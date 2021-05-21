package main



import (
	//Modulos built-in
	"bytes"
	"context"
	"fmt"
	"log"
	//"time"
	// Para oir a peticiones GET Y POST
    "net/http"
	// Enviar datos en json
	"encoding/json"

	// Libreria de Google PubSub
	"cloud.google.com/go/pubsub"
)

type Persona struct {
	Name         string `json:"name"`
	Location     string `json:"location"`
	Age          int32  `json:"age"`
	InfectedType string `json:"infectedtype"`
	State        string `json:"state"`
	Way			 string `json:"way"`
}


func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func main() {


	fmt.Println("Suscribe Google PubSub iniciado")

	//topicID := "projects/so1-proyecto1-307321/topics/Proyecto1"

	ctx := context.Background()
	projectID := "so1-proyecto1-307321"
	//subName := "projects/so1-proyecto1-307321/subscriptions/sub_so1"
	subName := "sub_so1"

	client, err := pubsub.NewClient(ctx, projectID)
	
	if err != nil {
		log.Fatal(err)
		fmt.Println("error")
	}

	// Use a callback to receive messages via subscription1.
	sub := client.Subscription(subName)

	err = sub.Receive(ctx, func(ctx context.Context, m *pubsub.Message) {
		fmt.Println("Nuevo msj ", string(m.Data))
		var personaNueva Persona
		json.Unmarshal(m.Data,&personaNueva)
		fmt.Println(personaNueva)

		tipo_mensajeria := "Google PubSub"
		mensaje := Persona{
			Name:personaNueva.Name, 
			Location:personaNueva.Location, 
			Age:personaNueva.Age, 
			InfectedType: personaNueva.InfectedType, 
			State: personaNueva.State, 
			Way: tipo_mensajeria,
		}
		
		infectado, _ := json.Marshal(mensaje) 
		
		fmt.Println(string(infectado))

		req, err := http.Post("http://34.72.201.120:4000/postInfectado", "application/json", bytes.NewBuffer([]byte(string(infectado))))
		req.Header.Set("Content-Type", "application/json")
		failOnError(err, "POST new document")
		defer req.Body.Close()


		
		m.Ack() // Acknowledge that we've consumed the message.

		
	})
	if err != nil {
		log.Println(err)
	}

}



