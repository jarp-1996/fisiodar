package server

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Server represents the API server structure.
type Server struct {
	DB     *pgxpool.Pool
	Router *chi.Mux
}

// NewServer initializes a new Server with middlewares and routing.
func NewServer(db *pgxpool.Pool) *Server {
	s := &Server{
		DB:     db,
		Router: chi.NewRouter(),
	}

	s.setupMiddlewares()
	s.setupRoutes()

	return s
}

func (s *Server) setupMiddlewares() {
	// Standard Chi middlewares
	s.Router.Use(middleware.Logger)
	s.Router.Use(middleware.Recoverer)
	s.Router.Use(middleware.Timeout(60 * time.Second))

	// CORS configuration for local development
	s.Router.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000") // Next.js default port
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.Header().Set("Access-Control-Allow-Credentials", "true")

			// Handle preflight requests
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	})
}

func (s *Server) setupRoutes() {
	// Health check endpoint
	s.Router.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok","message":"Fisiodar API is healthy"}`))
	})

	// Mount API routes
	s.Router.Route("/api", func(r chi.Router) {
		r.Mount("/auth", s.authRoutes())
		r.Mount("/appointments", s.appointmentRoutes())
		r.Mount("/records", s.recordRoutes())
		r.Mount("/users", s.userRoutes())
	})
}

// Start kicks off the HTTP listener.
func (s *Server) Start() error {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	addr := fmt.Sprintf(":%s", port)
	fmt.Printf("Fisiodar API is starting on port %s...\n", port)
	return http.ListenAndServe(addr, s.Router)
}
