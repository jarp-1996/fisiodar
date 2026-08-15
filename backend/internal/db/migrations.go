package db

import (
	"context"
	"log"
	"os"
	"path/filepath"

	"github.com/jackc/pgx/v5/pgxpool"
)

// RunMigrations reads the migrations up SQL file and applies it to the DB.
func RunMigrations(pool *pgxpool.Pool) error {
	log.Println("Running database migrations...")

	// Find the migration file (using a relative path from the root execution context)
	migrationPath := filepath.Join("db", "migrations", "000001_init_schema.up.sql")
	
	// Read SQL migration content
	sqlContent, err := os.ReadFile(migrationPath)
	if err != nil {
		return err
	}

	// Execute migration transactionally
	ctx := context.Background()
	tx, err := pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	_, err = tx.Exec(ctx, string(sqlContent))
	if err != nil {
		return err
	}

	err = tx.Commit(ctx)
	if err != nil {
		return err
	}

	log.Println("Database migrations applied successfully!")
	return nil
}
