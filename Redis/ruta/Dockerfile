FROM golang:1.12.0-alpine3.9
RUN mkdir /app
ADD . /app
WORKDIR /app

RUN apk update
RUN apk add git

RUN go get github.com/golang/gddo/httputil/header
RUN go get gopkg.in/redis.v2
RUN go get go.mongodb.org/mongo-driver/mongo/options

EXPOSE 2500
EXPOSE 6379

RUN go build -o main .
CMD ["/app/main"]