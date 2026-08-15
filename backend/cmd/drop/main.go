package main

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load(".env")
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL env variable not found")
	}

	ctx := context.Background()
	conn, err := pgx.Connect(ctx, dbURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer conn.Close(ctx)

	queries := []string{
		"DROP TABLE IF EXISTS medical_records CASCADE",
		"DROP TABLE IF EXISTS appointments CASCADE",
		"DROP TABLE IF EXISTS users CASCADE",
		"DROP TABLE IF EXISTS schema_migrations CASCADE",
	}

	for _, q := range queries {
		_, err := conn.Exec(ctx, q)
		if err != nil {
			log.Printf("Failed: %s -> %v", q, err)
		} else {
			log.Printf("Success: %s", q)
		}
	}
	log.Println("Database reset completed successfully!")
}
