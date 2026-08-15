package server

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
)

type CreateRecordRequest struct {
	PatientID     string  `json:"patient_id"`
	AppointmentID *string `json:"appointment_id,omitempty"` // Optional
	Diagnosis     string  `json:"diagnosis"`
	Treatment     string  `json:"treatment"`
}

type RecordResponse struct {
	ID            string     `json:"id"`
	PatientID     string     `json:"patient_id"`
	PatientName   string     `json:"patient_name,omitempty"`
	TherapistID   string     `json:"therapist_id"`
	TherapistName string     `json:"therapist_name,omitempty"`
	AppointmentID *string    `json:"appointment_id,omitempty"`
	Diagnosis     string     `json:"diagnosis"`
	Treatment     string     `json:"treatment"`
	CreatedAt     time.Time  `json:"created_at"`
}

// Mount Record routes
func (s *Server) recordRoutes() chi.Router {
	r := chi.NewRouter()

	r.Use(s.AuthMiddleware)

	// Only therapists and admins can create medical records
	r.With(RequireRole("therapist", "admin")).Post("/", s.handleCreateMedicalRecord)
	
	// Get medical history of a specific patient
	r.Get("/patient/{patientId}", s.handleGetMedicalHistory)

	return r
}

func (s *Server) handleCreateMedicalRecord(w http.ResponseWriter, r *http.Request) {
	user, _ := GetUserFromContext(r.Context())

	var req CreateRecordRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if req.PatientID == "" || req.Diagnosis == "" || req.Treatment == "" {
		http.Error(w, "Patient ID, diagnosis, and treatment are required", http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	// Verify target patient actually exists and is a patient
	var patientRole string
	err = s.DB.QueryRow(ctx, "SELECT role FROM users WHERE id = $1", req.PatientID).Scan(&patientRole)
	if err != nil || patientRole != "patient" {
		http.Error(w, "Invalid patient ID", http.StatusBadRequest)
		return
	}

	var record RecordResponse

	// Insert medical record using the therapist's user ID from context
	err = s.DB.QueryRow(ctx, `
		INSERT INTO medical_records (patient_id, therapist_id, appointment_id, diagnosis, treatment)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, patient_id, therapist_id, appointment_id, diagnosis, treatment, created_at
	`, req.PatientID, user.UserID, req.AppointmentID, req.Diagnosis, req.Treatment).Scan(
		&record.ID,
		&record.PatientID,
		&record.TherapistID,
		&record.AppointmentID,
		&record.Diagnosis,
		&record.Treatment,
		&record.CreatedAt,
	)

	if err != nil {
		log.Printf("Failed to create medical record: %v", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(record)
}

func (s *Server) handleGetMedicalHistory(w http.ResponseWriter, r *http.Request) {
	user, _ := GetUserFromContext(r.Context())
	patientID := chi.URLParam(r, "patientId")

	// Privacy check: Patient can only fetch their own medical history
	if user.Role == "patient" && user.UserID != patientID {
		http.Error(w, "Forbidden: you cannot view another patient's medical records", http.StatusForbidden)
		return
	}

	ctx := r.Context()
	rows, err := s.DB.Query(ctx, `
		SELECT mr.id, mr.patient_id, u_pat.first_name || ' ' || u_pat.last_name,
		       mr.therapist_id, u_ther.first_name || ' ' || u_ther.last_name,
		       mr.appointment_id, mr.diagnosis, mr.treatment, mr.created_at
		FROM medical_records mr
		JOIN users u_pat ON mr.patient_id = u_pat.id
		JOIN users u_ther ON mr.therapist_id = u_ther.id
		WHERE mr.patient_id = $1
		ORDER BY mr.created_at DESC
	`, patientID)

	if err != nil {
		log.Printf("Failed to query medical history: %v", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	records := []RecordResponse{}
	for rows.Next() {
		var mr RecordResponse
		err := rows.Scan(
			&mr.ID, &mr.PatientID, &mr.PatientName,
			&mr.TherapistID, &mr.TherapistName,
			&mr.AppointmentID, &mr.Diagnosis, &mr.Treatment, &mr.CreatedAt,
		)
		if err != nil {
			log.Printf("Failed to scan medical record row: %v", err)
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}
		records = append(records, mr)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(records)
}
