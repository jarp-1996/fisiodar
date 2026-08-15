package main

import (
	"log"

	"github.com/joho/godotenv"
	"fisiodar/backend/internal/db"
	"fisiodar/backend/internal/notifications"
	"fisiodar/backend/internal/server"
)

func main() {
	// Load environment variables from .env file if it exists
	// We ignore error since we may configure via native system env variables in production
	_ = godotenv.Load()

	log.Println("Starting Fisiodar backend service...")

	// 1. Initialize PostgreSQL database connection pool
	pool, err := db.InitDB()
	if err != nil {
		log.Fatalf("Database initialization failed: %v", err)
	}
	defer pool.Close()

	// 2. Run Database Migrations
	err = db.RunMigrations(pool)
	if err != nil {
		log.Fatalf("Applying database migrations failed: %v", err)
	}

	// 3. Seed Database with initial mock data
	err = db.SeedDatabase(pool)
	if err != nil {
		log.Fatalf("Seeding database failed: %v", err)
	}

	// 3.5 Start background notification worker
	worker := notifications.NewNotificationWorker(pool)
	worker.Start()
	defer worker.Stop()

	// 4. Create and start the HTTP server
	srv := server.NewServer(pool)
	err = srv.Start()
	if err != nil {
		log.Fatalf("Server failed to run: %v", err)
	}
}
