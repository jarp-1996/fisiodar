package db

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

// SeedDatabase inserts initial roles/users for testing.
func SeedDatabase(pool *pgxpool.Pool) error {
	ctx := context.Background()

	// Check if users already exist
	var count int
	err := pool.QueryRow(ctx, "SELECT COUNT(*) FROM users").Scan(&count)
	if err != nil {
		return err
	}

	if count > 0 {
		log.Println("Database already seeded (users table not empty). Skipping.")
		return nil
	}

	log.Println("Seeding database with default users...")

	users := []struct {
		Email     string
		Password  string
		FirstName string
		LastName  string
		Phone     string
		Role      string
	}{
		{"admin@physio.com", "admin123", "Admin", "User", "123456789", "admin"},
		{"therapist@physio.com", "therapist123", "Dariana", "Fisioterapeuta", "958108389", "therapist"},
		{"patient@physio.com", "patient123", "Maria", "Gomez", "555123456", "patient"},
	}

	for _, u := range users {
		// Hash password using bcrypt
		hashedBytes, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}

		// Insert user
		_, err = pool.Exec(ctx, `
			INSERT INTO users (email, password_hash, first_name, last_name, phone, role)
			VALUES ($1, $2, $3, $4, $5, $6)
		`, u.Email, string(hashedBytes), u.FirstName, u.LastName, u.Phone, u.Role)
		
		if err != nil {
			log.Printf("Failed to seed user %s: %v", u.Email, err)
			return err
		}
	}

	log.Println("Database seeding completed successfully!")
	return nil
}
