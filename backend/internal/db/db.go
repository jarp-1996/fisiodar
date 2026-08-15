package db

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// InitDB initializes a connection pool to PostgreSQL.
func InitDB() (*pgxpool.Pool, error) {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		return nil, fmt.Errorf("DATABASE_URL env variable is not set")
	}

	// Configure pool parameters
	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		return nil, fmt.Errorf("unable to parse database config: %w", err)
	}

	// Set connection limits
	config.MaxConns = 10
	config.MinConns = 2
	config.MaxConnIdleTime = 15 * time.Minute
	config.MaxConnLifetime = 1 * time.Hour

	// Try to connect (with retries in case database takes time to boot up)
	var pool *pgxpool.Pool
	for i := 0; i < 5; i++ {
		pool, err = pgxpool.NewWithConfig(context.Background(), config)
		if err == nil {
			// Ping database to confirm connection is active
			err = pool.Ping(context.Background())
			if err == nil {
				log.Println("Successfully connected to PostgreSQL database")
				return pool, nil
			}
		}

		log.Printf("Database connection attempt %d failed: %v. Retrying in 2 seconds...", i+1, err)
		time.Sleep(2 * time.Second)
	}

	return nil, fmt.Errorf("failed to connect to database after retries: %w", err)
}
