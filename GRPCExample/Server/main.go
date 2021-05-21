package main

import (
	"context"
	"log"
	"net"
	"bytes"
	"io/ioutil"
	"net/http"

	"google.golang.org/grpc"
	pb "google.golang.org/grpc/examples/helloworld/helloworld"
)

const (
	port = ":4000"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

// server is used to implement helloworld.GreeterServer.
type server struct {
	pb.UnimplementedGreeterServer
}

// SayHello implements helloworld.GreeterServer
func (s *server) SayHello(ctx context.Context, in *pb.HelloRequest) (*pb.HelloReply, error) {
	log.Printf("Received: %v", in.GetName())

	postBody := []byte(string(in.GetName()))
	// req, err := http.Post("http://localhost:5000/", "application/json", bytes.NewBuffer(postBody))
	// req, err := http.Post("http://mongo-server-kathy:5000/", "application/json", bytes.NewBuffer(postBody))
	// req, err := http.Post("http://34.72.201.120:4000/postInfectado", "application/json", bytes.NewBuffer(postBody))
	req, err := http.Post("https://us-central1-nifty-inkwell-308322.cloudfunctions.net/redis", "application/json", bytes.NewBuffer(postBody))
	req.Header.Set("Content-Type", "application/json")
	if err!=nil{
		log.Fatal("Error en POST REDIS")
	}
	defer req.Body.Close()

	//Read the response body
	newBody, err := ioutil.ReadAll(req.Body)
	sb := ""
	if err!=nil{
		sb = "Error en REDIS"
	}else{
		sb = string(newBody)
	}
	log.Printf(sb)

	//PARA MONGO ----------------------------------
	req2, err2 := http.Post("http://35.188.10.198:4000/postInfectado", "application/json", bytes.NewBuffer(postBody))
	req2.Header.Set("Content-Type", "application/json")
	if err2!=nil{
		log.Fatal("Error en POST MONGO")
	}
	defer req2.Body.Close()

	//Read the response body
	newBody2, err2 := ioutil.ReadAll(req2.Body)
	sb2 := ""
	if err2!=nil{
		sb2 = "Error en MONGO"
	}else{
		sb2 = string(newBody2)
	}
	log.Printf(sb2)
	// return &pb.HelloReply{Message: "SOPES1: " + in.GetName()}, nil
	return &pb.HelloReply{Message: "Redis, " + sb + ", Mongo, " +  sb2}, nil
}


func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterGreeterServer(s, &server{})
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}