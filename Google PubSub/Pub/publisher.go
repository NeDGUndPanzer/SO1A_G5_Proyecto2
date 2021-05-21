package main

import (
	//Modulos built-in
	"context"
	"fmt"
	//"os"
	"log"
	// Para oir a peticiones GET Y POST
    "net/http"
	// Enviar datos en json
	"encoding/json"

	// Libreria de Google PubSub
	"cloud.google.com/go/pubsub"
)


// Esta funcion es utilizada para publicar un mensaje
// Como parametro se manda el mensaje que publicaremos a PubSub
func publish(msg string) error {
	// Definimos el ProjectID del proyecto
	// Este dato lo sacamos de Google Cloud
	projectID := "so1-proyecto1-307321"

	// Definimos el TopicId del proyecto
	// Este dato lo sacamos de Google Cloud
	//topicID := "projects/so1-proyecto1-307321/topics/Proyecto1"
	topicID := "Proyecto1"

	// Definimos el contexto en el que ejecutaremos PubSub
	ctx := context.Background()
	// Creamos un nuevo cliente
	client, err := pubsub.NewClient(ctx, projectID)
	// Si un error ocurrio creando el nuevo cliente, entonces imprimimos un error y salimos
	if err != nil {
		fmt.Println("error")
		return fmt.Errorf("pubsub.NewClient: %v", err)
	}
	
	// Obtenemos el topico al que queremos enviar el mensaje
	t := client.Topic(topicID)

	// Publicamos los datos del mensaje
	result := t.Publish(ctx, &pubsub.Message { Data: []byte(msg), })
	
	// Bloquear el contexto hasta que se tenga una respuesta de parte de GooglePubSub
	id, err := result.Get(ctx)
	
	// Si hubo un error creando el mensaje, entonces mostrar que existio un error
	if err != nil {
		fmt.Println("error")
		fmt.Println(err)
		return fmt.Errorf("Error: %v", err)
	}

	// El mensaje fue publicado correctamente
	fmt.Println("Published a message; msg ID: %v\n", id)
	return nil
}


func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

// Creamos un server sencillo que unicamente acepte peticiones GET y POST a '/'
func http_server(w http.ResponseWriter, r *http.Request) {

	if r.Method == "GET" {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("{\"message\": \"ok\"}"))
		return;
	}

	var body map[string]interface{}
	err := json.NewDecoder(r.Body).Decode(&body)
	failOnError(err, "Parsing JSON")
	data, _ := json.Marshal(body)

	// Publicar el mensaje, convertimos el objeto JSON a String
	publish(string(data))

	// Enviamos informacion de vuelta, indicando que fue generada la peticion
	fmt.Fprintf(w, "¡Mensaje Publicado!\n")
	fmt.Fprintln(w, string(data))
	
}

// Funcion de entrada del programa
func main() {

	fmt.Println("Server Google PubSub iniciado")

	// Asignar la funcion que controlara las llamadas http
	http.HandleFunc("/", http_server)

	// Obtener el puerto al cual conectarse desde una variable de ambiente
	http_port := ":5001"
	
	// Levantar el server, si existe un error levantandolo hay que apagarlo
    if err := http.ListenAndServe(http_port, nil); err != nil {
        log.Fatal(err)
    }
}
