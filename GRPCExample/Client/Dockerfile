FROM golang

WORKDIR /

COPY . .

RUN go mod download

EXPOSE 2500

CMD ["go", "run", "main.go"]