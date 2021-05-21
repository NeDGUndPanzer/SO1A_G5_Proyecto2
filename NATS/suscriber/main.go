package main

import (
	"log"
	"github.com/nats-io/nats.go"
	"net/http"
	"io/ioutil"
	"bytes"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func main() {
	// [begin subscribe_queue]
	nc, err := nats.Connect("nats://server-nats:4222")
	failOnError(err, "Error de inicio suscriber")
	defer nc.Close()

	forever := make(chan bool)
	// Subscribe
	go func() {
		_, err := nc.Subscribe("SOPES1", func(m *nats.Msg) {
			log.Printf("Echoing to [%s]: %q", m.Reply, m.Data)

			postBody := []byte(string(m.Data))
			req, err := http.Post("http://34.72.201.120:4000/postInfectado", "application/json", bytes.NewBuffer(postBody))
			req.Header.Set("Content-Type", "application/json")
			failOnError(err, "POST new document")
			//Read the response body --->
			newBody, err := ioutil.ReadAll(req.Body)
			failOnError(err, "Reading response from HTTP POST")
			sb := string(newBody)
			log.Printf(sb)
		})
		failOnError(err, "Error en suscriber NATS")
	}()
	
	log.Printf(" [*] Waiting for messages. To exit press CTRL+C")
	<-forever
	
}