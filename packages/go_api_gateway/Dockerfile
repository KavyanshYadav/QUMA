FROM golang:1.25-alpine

WORKDIR /app

# Install air for live rel
RUN go install github.com/air-verse/air@latest


COPY packages/go_api_gateway/go.mod packages/go_api_gateway/go.sum ./
RUN go mod download

COPY packages/go_api_gateway/ .

EXPOSE 6900

# Run air (live reload)
CMD ["air", "-c", ".air.toml"]
