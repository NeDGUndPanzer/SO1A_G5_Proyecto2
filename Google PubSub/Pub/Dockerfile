FROM golang
WORKDIR /
COPY . .
ENV GOOGLE_APPLICATION_CREDENTIALS="./Key.json"
RUN go mod download
EXPOSE 5001
CMD ["go", "run", "publisher.go"]