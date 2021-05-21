package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/nats-io/nats.go"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func nuevoElemento(w http.ResponseWriter, r *http.Request) {
	// Adding headers
	w.Header().Set("Content-Type", "application/json")
	if r.Method == "GET" {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("{\"message\": \"ok\"}"))
		return;
	}

	// Parsing body
	var body map[string]interface{}
	err := json.NewDecoder(r.Body).Decode(&body)
	failOnError(err, "Parsing JSON")
	body["way"] = "NATS"
	data, err := json.Marshal(body)

	resultado := string(data) 
	nc, err := nats.Connect("nats://server-nats:4222", nats.Name("SOPES1"))
	failOnError(err, "Error de conexion a NATS")
	defer nc.Close()

	errr := nc.Publish("SOPES1", []byte(resultado))
	failOnError(errr, "Error de resultado")

	// Setting status and send response
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(resultado))
}

func handleRequests() {
	http.HandleFunc("/", nuevoElemento)
	log.Fatal(http.ListenAndServe(":3000", nil))
}

func main() {
	handleRequests()
}