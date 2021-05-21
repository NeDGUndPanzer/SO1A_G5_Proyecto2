package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"./driver/pubsub"
	"github.com/golang/gddo/httputil/header"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/redis.v2"
)

var (
	pub      *redis.IntCmd
	err      error
	iterador int
)

type infectados struct {
	Name          string `json:"name"`
	Location      string `json:"location"`
	Age           int32  `json:"age"`
	Vaccine_type  string `json:"vaccine_type"`
	Gender        string `json:"gender"`
}


type malformedRequest struct {
	status int
	msg    string
}

func (mr *malformedRequest) Error() string {
	return mr.msg
}

func decodeJSONBody(w http.ResponseWriter, r *http.Request, dst interface{}) error {
	if r.Header.Get("Content-Type") != "" {
		value, _ := header.ParseValueAndParams(r.Header, "Content-Type")
		if value != "application/json" {
			msg := "Content-Type header is not application/json"
			return &malformedRequest{status: http.StatusUnsupportedMediaType, msg: msg}
		}
	}

	r.Body = http.MaxBytesReader(w, r.Body, 1048576)

	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	err := dec.Decode(&dst)
	if err != nil {
		switch {
		case err.Error() == "http: request body too large":
			msg := "Request body must not be larger than 1MB"
			return &malformedRequest{status: http.StatusRequestEntityTooLarge, msg: msg}

		default:
			return err
		}
	}

	err = dec.Decode(&struct{}{})
	if err != io.EOF {
		msg := "Request body must only contain a single JSON object"
		return &malformedRequest{status: http.StatusBadRequest, msg: msg}
	}

	return nil
}

func hello(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.Error(w, "404 not found.", http.StatusNotFound)
		return
	}

	switch r.Method {
	case "POST":
		// Call ParseForm() to parse the raw query and update r.PostForm and r.Form.
		if err := r.ParseForm(); err != nil {
			fmt.Fprintf(w, "ParseForm() err: %v", err)
			return
		}

		var infectado infectados

		err := decodeJSONBody(w, r, &infectado)
		if err != nil {
			log.Println(err.Error())
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			panic(err.Error())
		}

		// -- Publish some stuf --
		pub = pubsub.Service.Publish("pubsub", infectado)
		if err = pub.Err(); err != nil {
			log.Print("PublishString() error", err)
		}

	default:
		fmt.Fprintf(w, "Sorry, only GET and POST methods are supported.")
	}
}

func methodhttp() {
	http.HandleFunc("/", hello)

	fmt.Printf("Starting server for testing HTTP POST...\n")
	if err := http.ListenAndServe(":2500", nil); err != nil {
		log.Fatal(err)
	}
}

func methodredis() {
	// Create a subscriber
	_, err = pubsub.NewSubscriber("pubsub", redischannel)
	if err != nil {
		log.Println("NewSubscriber() error", err)
	}
	log.Print("Subscriptions done. Publishing...")

	_ = pub
	log.Print("Publishing done. Sleeping...")

	for {
		time.Sleep(time.Second)
	}
}

func main() {
	go methodhttp()
	methodredis()
}

func mongoInsertCaso(caso *infectados) {
	// Creamos el client para mongo db
	// TODO: que se establesca la coneccion a mongodb solo cuando inicie el programa
	// no cada vez que vamos a mandar algo
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb+srv://eliel:12345@cluster0.xm3ru.mongodb.net/so1?retryWrites=true&w=majority"))
	if err != nil {
		log.Fatal(err)
	}
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	collection := client.Database("so1").Collection("datacovid")
	insertResult, err := collection.InsertOne(context.TODO(), caso)
	if err != nil {
		log.Fatal(err)
	}
	log.Print("Este es el caso ", caso)
	infectado,_:=json.Marshal(caso)
	log.Print(string(infectado))


	req, err := http.Post("http://35.188.10.198:4000/postInfectado", "application/json", bytes.NewBuffer([]byte(string(infectado))))
	req.Header.Set("Content-Type", "application/json")

	req2, err := http.Post("https://us-central1-nifty-inkwell-308322.cloudfunctions.net/redis", "application/json", bytes.NewBuffer([]byte(string(infectado))))
	req2.Header.Set("Content-Type", "application/json")

	// TODO: imprimir el valor entero de caso porque no esta llegando nada del json
	fmt.Printf("Inserto caso con ID:%s Name:%s \n", insertResult.InsertedID, caso.Name)
}

func redischannel(channel, payload string) {
	// var i []infectados
	var i infectados

	if payload != "" {
		err := json.Unmarshal([]byte(payload), &i)
		if err != nil {
			log.Printf("Unmarshal error: %v", err)
			return
		}

		pubsub.Service.SavaData("caso", fmt.Sprintf("caso:r:%v", iterador), i)
		iterador++
		mongoInsertCaso(&i)

		log.Printf("Infectado = %v.", i)
	}
}

/*
PUBLISH pubsub "[{\"name\":\"Pablo Mendoza\",\"location\":\"Guatemala City\",\"age\":35,\"infected_type\":\"communitary\",\"state\": \"asymptomatic\"},{\"name\":\"Luis Rivera\",\"location\":\"Peten\",\"age\":20,\"infected_type\":\"communitary\",\"state\": \"asymptomatic\"},{\"name\":\"Pedro Guerra\",\"location\":\"Izabal\",\"age\":68,\"infected_type\":\"communitary\",\"state\": \"asymptomatic\"}]"
PUBLISH pubsub "{\"name\":\"Pablo Mendoza\",\"location\":\"Guatemala City\",\"age\":35,\"infected_type\":\"communitary\",\"state\": \"asymptomatic\"}"
PUBLISH food "[{\"name\":\"Big Mac\",\"calories\":200},{\"name\":\"Whooper\",\"calories\":150}]"
*/