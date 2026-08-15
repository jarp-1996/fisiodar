package server

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecret = []byte(getEnv("JWT_SECRET", "super-secret-key-change-in-production"))

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

// Request and Response Structs
type RegisterRequest struct {
	Email          string   `json:"email"`
	Password       string   `json:"password"`
	FirstName      string   `json:"first_name"`
	LastName       string   `json:"last_name"`
	Phone          string   `json:"phone"`
	Weight         *float64 `json:"weight,omitempty"`
	MedicalHistory *string  `json:"medical_history,omitempty"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserResponse struct {
	ID             string   `json:"id"`
	Email          string   `json:"email"`
	FirstName      string   `json:"first_name"`
	LastName       string   `json:"last_name"`
	Phone          string   `json:"phone"`
	Role           string   `json:"role"`
	Weight         *float64 `json:"weight,omitempty"`
	MedicalHistory *string  `json:"medical_history,omitempty"`
}

type AuthResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

type Claims struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// Mount Auth routes
func (s *Server) authRoutes() chi.Router {
	r := chi.NewRouter()
	r.Post("/register", s.handleRegister)
	r.Post("/login", s.handleLogin)
	return r
}

func (s *Server) handleRegister(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Basic validation
	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	if req.Email == "" || req.Password == "" || req.FirstName == "" || req.LastName == "" {
		http.Error(w, "Email, password, first name, and last name are required", http.StatusBadRequest)
		return
	}

	if len(req.Password) < 6 {
		http.Error(w, "Password must be at least 6 characters long", http.StatusBadRequest)
		return
	}

	// Hash password
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	ctx := r.Context()
	var user UserResponse

	// Default role is always 'patient' for public register endpoint
	role := "patient"

	// Insert into DB
	err = s.DB.QueryRow(ctx, `
		INSERT INTO users (email, password_hash, first_name, last_name, phone, role, weight, medical_history)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, email, first_name, last_name, phone, role, weight, medical_history
	`, req.Email, string(hashedBytes), req.FirstName, req.LastName, req.Phone, role, req.Weight, req.MedicalHistory).
		Scan(&user.ID, &user.Email, &user.FirstName, &user.LastName, &user.Phone, &user.Role, &user.Weight, &user.MedicalHistory)

	if err != nil {
		// Handle duplicate email violation
		if strings.Contains(err.Error(), "duplicate key value") || strings.Contains(err.Error(), "unique constraint") {
			http.Error(w, "Email already in use", http.StatusConflict)
			return
		}
		log.Printf("Failed to register user: %v", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Generate JWT Token
	tokenString, err := generateToken(user.ID, user.Email, user.Role)
	if err != nil {
		http.Error(w, "Failed to generate auth token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(AuthResponse{
		Token: tokenString,
		User:  user,
	})
}

func (s *Server) handleLogin(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	req.Email = strings.TrimSpace(strings.ToLower(req.Email))

	ctx := r.Context()
	var user UserResponse
	var passwordHash string

	// Fetch user details and password hash from database
	err = s.DB.QueryRow(ctx, `
		SELECT id, email, password_hash, first_name, last_name, phone, role, weight, medical_history
		FROM users
		WHERE email = $1
	`, req.Email).Scan(&user.ID, &user.Email, &passwordHash, &user.FirstName, &user.LastName, &user.Phone, &user.Role, &user.Weight, &user.MedicalHistory)

	if err != nil {
		// User not found or DB error
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	// Verify password
	err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password))
	if err != nil {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	// Generate JWT Token
	tokenString, err := generateToken(user.ID, user.Email, user.Role)
	if err != nil {
		http.Error(w, "Failed to generate auth token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(AuthResponse{
		Token: tokenString,
		User:  user,
	})
}

func generateToken(userID, email, role string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)

	claims := &Claims{
		UserID: userID,
		Email:  email,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}
