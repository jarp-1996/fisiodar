package notifications

import (
	"context"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// NotificationWorker handles background checks for sending appointment reminders.
type NotificationWorker struct {
	DB      *pgxpool.Pool
	ticker  *time.Ticker
	stopCh  chan struct{}
}

// NewNotificationWorker creates a background worker instance.
func NewNotificationWorker(db *pgxpool.Pool) *NotificationWorker {
	return &NotificationWorker{
		DB:     db,
		stopCh: make(chan struct{}),
	}
}

// Start spawns the background routine.
func (w *NotificationWorker) Start() {
	// Check every 30 seconds
	w.ticker = time.NewTicker(30 * time.Second)
	
	log.Println("Starting background notification worker service...")

	go func() {
		for {
			select {
			case <-w.ticker.C:
				w.checkAndSendReminders()
			case <-w.stopCh:
				log.Println("Stopping background notification worker...")
				w.ticker.Stop()
				return
			}
		}
	}()
}

// Stop signals the background goroutine to shut down.
func (w *NotificationWorker) Stop() {
	close(w.stopCh)
}

func (w *NotificationWorker) checkAndSendReminders() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Query appointments happening in the next 24 hours that are 'confirmed'
	// and simulate sending an email/SMS notification
	now := time.Now()
	tomorrow := now.Add(24 * time.Hour)

	rows, err := w.DB.Query(ctx, `
		SELECT a.id, 
		       u_pat.first_name || ' ' || u_pat.last_name as patient_name, u_pat.phone as patient_phone, u_pat.email as patient_email,
		       u_ther.first_name || ' ' || u_ther.last_name as therapist_name,
		       a.appointment_time
		FROM appointments a
		JOIN users u_pat ON a.patient_id = u_pat.id
		JOIN users u_ther ON a.therapist_id = u_ther.id
		WHERE a.status = 'confirmed' 
		  AND a.appointment_time BETWEEN $1 AND $2
	`, now, tomorrow)

	if err != nil {
		log.Printf("[Worker Error] Failed to query upcoming appointments: %v", err)
		return
	}
	defer rows.Close()

	count := 0
	for rows.Next() {
		var apptID, patName, patPhone, patEmail, therName string
		var apptTime time.Time

		err := rows.Scan(&apptID, &patName, &patPhone, &patEmail, &therName, &apptTime)
		if err != nil {
			log.Printf("[Worker Error] Failed to scan row: %v", err)
			continue
		}

		// Simulate notification sending (logging to stdout)
		log.Printf("[NOTIFICACIÓN SIMULADA] Recordatorio enviado para cita %s: Hola %s, recuerda tu turno de fisioterapia mañana a las %s con el especialista %s. WhatsApp: %s / Correo: %s",
			apptID[:8], patName, apptTime.Format("15:04"), therName, patPhone, patEmail)
		
		count++
	}

	if count > 0 {
		log.Printf("[Worker Status] Reminders check completed: %d notifications simulated.", count)
	}
}
