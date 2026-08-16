# Etapa de construcción
FROM golang:alpine AS builder

WORKDIR /app

# Copiar go mod y sum files
COPY go.mod go.sum ./

# Descargar todas las dependencias
RUN go mod download

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/api

# Etapa final (imagen ligera)
FROM alpine:latest  

WORKDIR /root/

# Copiar el binario precompilado
COPY --from=builder /app/main .

# Exponer el puerto (Render y Railway suelen usar la variable PORT)
EXPOSE 8080

# Comando para ejecutar
CMD ["./main"]
