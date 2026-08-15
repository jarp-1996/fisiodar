package server

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
)

type CreateAppointmentRequest struct {
	TherapistID     string    `json:"therapist_id"`
	AppointmentTime time.Time `json:"appointment_time"`
	Notes           string    `json:"notes"`
}

type UpdateStatusRequest struct {
	Status string `json:"status"` // 'pending', 'confirmed', 'cancelled', 'completed'
}

type AppointmentResponse struct {
	ID              string    `json:"id"`
	PatientID       string    `json:"patient_id"`
	PatientName     string    `json:"patient_name,omitempty"`
	TherapistID     string    `json:"therapist_id"`
	TherapistName   string    `json:"therapist_name,omitempty"`
	AppointmentTime time.Time `json:"appointment_time"`
	Status          string    `json:"status"`
	Notes           string    `json:"notes"`
	CreatedAt       time.Time `json:"created_at"`
}

// Mount Appointment routes
func (s *Server) appointmentRoutes() chi.Router {
	r := chi.NewRouter()
	
	// Secure all routes with auth middleware
	r.Use(s.AuthMiddleware)

	r.Post("/", s.handleCreateAppointment)
	r.Get("/", s.handleGetAppointments)
	r.Put("/{id}/status", s.handleUpdateAppointmentStatus)

	return r
}

func (s *Server) handleCreateAppointment(w http.ResponseWriter, r *http.Request) {
	user, _ := GetUserFromContext(r.Context())

	var req CreateAppointmentRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if req.TherapistID == "" || req.AppointmentTime.IsZero() {
		http.Error(w, "Therapist ID and appointment time are required", http.StatusBadRequest)
		return
	}

	// Validate appointment is in the future
	if req.AppointmentTime.Before(time.Now()) {
		http.Error(w, "Appointment time must be in the future", http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	// Verify the therapist exists and actually has the role 'therapist'
	var therapistRole string
	err = s.DB.QueryRow(ctx, "SELECT role FROM users WHERE id = $1", req.TherapistID).Scan(&therapistRole)
	if err != nil || therapistRole != "therapist" {
		http.Error(w, "Invalid therapist ID", http.StatusBadRequest)
		return
	}

	// Double booking check: ensure therapist doesn't have another appointment at the exact same time
	var exists bool
	err = s.DB.QueryRow(ctx, `
		SELECT EXISTS(
			SELECT 1 FROM appointments 
			WHERE therapist_id = $1 AND appointment_time = $2 AND status != 'cancelled'
		)
	`, req.TherapistID, req.AppointmentTime).Scan(&exists)
	if err != nil {
		log.Printf("Failed checking double booking: %v", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	if exists {
		http.Error(w, "Therapist is already booked at this slot", http.StatusConflict)
		return
	}

	// Patient ID is taken from token context (or optionally from payload if admin is booking, but for now we simplify to user context)
	patientID := user.UserID

	var appointment AppointmentResponse

	err = s.DB.QueryRow(ctx, `
		INSERT INTO appointments (patient_id, therapist_id, appointment_time, notes)
		VALUES ($1, $2, $3, $4)
		RETURNING id, patient_id, therapist_id, appointment_time, status, notes, created_at
	`, patientID, req.TherapistID, req.AppointmentTime, req.Notes).Scan(
		&appointment.ID,
		&appointment.PatientID,
		&appointment.TherapistID,
		&appointment.AppointmentTime,
		&appointment.Status,
		&appointment.Notes,
		&appointment.CreatedAt,
	)

	if err != nil {
		log.Printf("Failed to create appointment: %v", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(appointment)
}

func (s *Server) handleGetAppointments(w http.ResponseWriter, r *http.Request) {
	user, _ := GetUserFromContext(r.Context())
	ctx := r.Context()

	var rowsQuery string
	var args []interface{}

	// Role-based filtering
	if user.Role == "patient" {
		rowsQuery = `
			SELECT a.id, a.patient_id, u_pat.first_name || ' ' || u_pat.last_name, 
			       a.therapist_id, u_ther.first_name || ' ' || u_ther.last_name, 
			       a.appointment_time, a.status, a.notes, a.created_at
			FROM appointments a
			JOIN users u_pat ON a.patient_id = u_pat.id
			JOIN users u_ther ON a.therapist_id = u_ther.id
			WHERE a.patient_id = $1
			ORDER BY a.appointment_time ASC
		`
		args = append(args, user.UserID)
	} else if user.Role == "therapist" {
		rowsQuery = `
			SELECT a.id, a.patient_id, u_pat.first_name || ' ' || u_pat.last_name, 
			       a.therapist_id, u_ther.first_name || ' ' || u_ther.last_name, 
			       a.appointment_time, a.status, a.notes, a.created_at
			FROM appointments a
			JOIN users u_pat ON a.patient_id = u_pat.id
			JOIN users u_ther ON a.therapist_id = u_ther.id
			WHERE a.therapist_id = $1
			ORDER BY a.appointment_time ASC
		`
		args = append(args, user.UserID)
	} else {
		// Admin sees all
		rowsQuery = `
			SELECT a.id, a.patient_id, u_pat.first_name || ' ' || u_pat.last_name, 
			       a.therapist_id, u_ther.first_name || ' ' || u_ther.last_name, 
			       a.appointment_time, a.status, a.notes, a.created_at
			FROM appointments a
			JOIN users u_pat ON a.patient_id = u_pat.id
			JOIN users u_ther ON a.therapist_id = u_ther.id
			ORDER BY a.appointment_time ASC
		`
	}

	rows, err := s.DB.Query(ctx, rowsQuery, args...)
	if err != nil {
		log.Printf("Failed to query appointments: %v", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	appointments := []AppointmentResponse{}
	for rows.Next() {
		var a AppointmentResponse
		err := rows.Scan(
			&a.ID, &a.PatientID, &a.PatientName,
			&a.TherapistID, &a.TherapistName,
			&a.AppointmentTime, &a.Status, &a.Notes, &a.CreatedAt,
		)
		if err != nil {
			log.Printf("Failed to scan appointment row: %v", err)
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}
		appointments = append(appointments, a)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(appointments)
}

func (s *Server) handleUpdateAppointmentStatus(w http.ResponseWriter, r *http.Request) {
	user, _ := GetUserFromContext(r.Context())
	appointmentID := chi.URLParam(r, "id")

	var req UpdateStatusRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Validate status transition
	status := req.Status
	if status != "pending" && status != "confirmed" && status != "cancelled" && status != "completed" {
		http.Error(w, "Invalid status type", http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	// Fetch appointment owner details to verify permission
	var patientID string
	var therapistID string
	var currentStatus string
	err = s.DB.QueryRow(ctx, "SELECT patient_id, therapist_id, status FROM appointments WHERE id = $1", appointmentID).
		Scan(&patientID, &therapistID, &currentStatus)
	if err != nil {
		http.Error(w, "Appointment not found", http.StatusNotFound)
		return
	}

	// Permissions check:
	// - Patients can only set status to 'cancelled' on their own appointments
	// - Therapists/Admins can set status to anything
	if user.Role == "patient" {
		if patientID != user.UserID {
			http.Error(w, "Forbidden: you do not own this appointment", http.StatusForbidden)
			return
		}
		if status != "cancelled" {
			http.Error(w, "Patients can only cancel appointments", http.StatusForbidden)
			return
		}
	} else if user.Role == "therapist" {
		if therapistID != user.UserID {
			http.Error(w, "Forbidden: you are not the assigned therapist", http.StatusForbidden)
			return
		}
	}

	// Update status
	_, err = s.DB.Exec(ctx, "UPDATE appointments SET status = $1 WHERE id = $2", status, appointmentID)
	if err != nil {
		log.Printf("Failed to update appointment status: %v", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
