package server

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
)

// Mount User routes
func (s *Server) userRoutes() chi.Router {
	r := chi.NewRouter()

	r.Use(s.AuthMiddleware)

	r.Get("/me", s.handleGetMe)
	r.Get("/therapists", s.handleGetTherapists)
	
	// Only therapists and admins can search/list patients
	r.With(RequireRole("therapist", "admin")).Get("/patients", s.handleGetPatients)

	return r
}

func (s *Server) handleGetMe(w http.ResponseWriter, r *http.Request) {
	user, _ := GetUserFromContext(r.Context())
	ctx := r.Context()

	var u UserResponse
	err := s.DB.QueryRow(ctx, `
		SELECT id, email, first_name, last_name, phone, role, weight, medical_history
		FROM users
		WHERE id = $1
	`, user.UserID).Scan(&u.ID, &u.Email, &u.FirstName, &u.LastName, &u.Phone, &u.Role, &u.Weight, &u.MedicalHistory)

	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(u)
}

func (s *Server) handleGetTherapists(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	rows, err := s.DB.Query(ctx, `
		SELECT id, email, first_name, last_name, phone, role
		FROM users
		WHERE role = 'therapist'
		ORDER BY first_name ASC
	`)
	if err != nil {
		log.Printf("Failed to query therapists: %v", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	therapists := []UserResponse{}
	for rows.Next() {
		var u UserResponse
		err := rows.Scan(&u.ID, &u.Email, &u.FirstName, &u.LastName, &u.Phone, &u.Role)
		if err != nil {
			log.Printf("Failed to scan therapist: %v", err)
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}
		therapists = append(therapists, u)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(therapists)
}

func (s *Server) handleGetPatients(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	rows, err := s.DB.Query(ctx, `
		SELECT id, email, first_name, last_name, phone, role, weight, medical_history
		FROM users
		WHERE role = 'patient'
		ORDER BY first_name ASC
	`)
	if err != nil {
		log.Printf("Failed to query patients: %v", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	patients := []UserResponse{}
	for rows.Next() {
		var u UserResponse
		err := rows.Scan(&u.ID, &u.Email, &u.FirstName, &u.LastName, &u.Phone, &u.Role, &u.Weight, &u.MedicalHistory)
		if err != nil {
			log.Printf("Failed to scan patient: %v", err)
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}
		patients = append(patients, u)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(patients)
}
