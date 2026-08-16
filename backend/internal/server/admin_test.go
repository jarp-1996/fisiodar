package server

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"
)

// TestAdminStatsEndpoint_Security verifies that only admins can access stats.
func TestAdminStatsEndpoint_Security(t *testing.T) {
	// 1. Arrange: Setup minimal server with chi router
	s := &Server{
		Router: chi.NewRouter(),
	}

	// Mount the route simulating server.go configuration
	s.Router.Route("/api/admin", func(r chi.Router) {
		r.Use(RequireRole("admin"))
		r.Mount("/", s.adminRoutes()) // This will fail compilation until we create it!
	})

	// 2. Define test cases
	tests := []struct {
		name         string
		role         string
		expectedCode int
	}{
		{"Patient Access Denied", "patient", http.StatusForbidden},
		{"Admin Access Granted", "admin", http.StatusOK},
	}

	// 3. Act & Assert
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			req, _ := http.NewRequest("GET", "/api/admin/stats", nil)
			
			// Inject mock user context directly to simulate AuthMiddleware passing
			ctx := context.WithValue(req.Context(), userContextKey, &UserContext{
				UserID: "123",
				Role:   tc.role,
			})
			req = req.WithContext(ctx)

			rr := httptest.NewRecorder()
			s.Router.ServeHTTP(rr, req)

			if tc.role == "patient" && rr.Code != tc.expectedCode {
				t.Errorf("Expected HTTP %d for role '%s', but got %d", tc.expectedCode, tc.role, rr.Code)
			}
			
			// For admin, we just want to make sure it's NOT forbidden by the middleware
			if tc.role == "admin" && rr.Code == http.StatusForbidden {
				t.Errorf("Admin should not get HTTP 403 Forbidden")
			}
		})
	}
}
