package main

import (
	"encoding/json"
	"log"
	"net/http"
	"context"
	"time"

	"google.golang.org/grpc"
	pb "google.golang.org/grpc/examples/helloworld/helloworld"
)

const (
	address = "localhost:4000"
	// address = "localhost:4000"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func newElement(w http.ResponseWriter, r *http.Request) {
	// Adding headers
	w.Header().Set("Content-Type", "application/json")
	if r.Method == "GET" {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("{\"message\": \"ok gRPC\"}"))
		return;
	}
	
	// Parsing body
	var body map[string]interface{}
	err := json.NewDecoder(r.Body).Decode(&body)
	failOnError(err, "Parsing JSON")
	// body["value"] = 1
	data, err := json.Marshal(body)

	// Server Connection
	conn, err := grpc.Dial(address, grpc.WithInsecure(), grpc.WithBlock())
	failOnError(err, "GRPC Connection")
	defer conn.Close()

	// Adding new client
	cli := pb.NewGreeterClient(conn)
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	// Sending data
	re, err := cli.SayHello(ctx, &pb.HelloRequest{Name: string(data)})
	if err != nil{
		log.Fatal("Error al enviar el mensaje")
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte("Error al enviar el mensaje"))
	}else{
		log.Print("Sent:")
		log.Printf("Response : %s", re.GetMessage())
		// Setting status and send response
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte(re.GetMessage()))
	}
}

func handleRequests() {
	http.HandleFunc("/", newElement)
	log.Fatal(http.ListenAndServe(":2500", nil))
}

func main() {
	handleRequests()
}
