FROM golang
WORKDIR /
COPY . .
ENV GOOGLE_APPLICATION_CREDENTIALS="./Key.json"
RUN go mod download

CMD ["go", "run", "suscribe.go"]