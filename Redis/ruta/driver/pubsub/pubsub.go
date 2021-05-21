package pubsub

import (
	"encoding/json"
	"log"

	"gopkg.in/redis.v2"
)

type PubSub struct {
	client *redis.Client
}

var Service *PubSub

func init() {
	var client *redis.Client
	client = redis.NewTCPClient(&redis.Options{
		Addr:     "34.121.1.240:6379",
		Password: "",
		DB:       0,
		PoolSize: 10,
	})
	Service = &PubSub{client}
}

func (ps *PubSub) PublishString(channel, message string) *redis.IntCmd {
	return ps.client.Publish(channel, message)
}

func (ps *PubSub) Publish(channel string, message interface{}) *redis.IntCmd {
	// TODO reflect if interface{} type is string, Publish as-is
	jsonBytes, err := json.Marshal(message)
	if err != nil {
		panic(err)
	}
	messageString := string(jsonBytes)
	return ps.client.Publish(channel, messageString)
}

func (ps *PubSub) SavaData(caso string, field string, message interface{}) {
	// TODO reflect if interface{} type is string, Publish as-is
	jsonBytes, err := json.Marshal(message)
	if err != nil {
		panic(err)
	}
	messageString := string(jsonBytes)
	log.Print("Dato Insertado en redis: ", messageString)
	ps.client.HSet(caso, field, messageString)
}