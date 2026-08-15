package server

import (
	"context"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const userContextKey contextKey = "user"

// UserContext holds auth details parsed from the JWT.
type UserContext struct {
	UserID string
	Email  string
	Role   string
}

// AuthMiddleware extracts JWT and verifies it, injecting user context into request.
func (s *Server) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Invalid authorization format. Use 'Bearer <token>'", http.StatusUnauthorized)
			return
		}

		tokenString := parts[1]
		claims := &Claims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Unauthorized: invalid or expired token", http.StatusUnauthorized)
			return
		}

		// Inject user info into context
		userCtxVal := &UserContext{
			UserID: claims.UserID,
			Email:  claims.Email,
			Role:   claims.Role,
		}

		ctx := context.WithValue(r.Context(), userContextKey, userCtxVal)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// GetUserFromContext retrieves the UserContext injected by AuthMiddleware.
func GetUserFromContext(ctx context.Context) (*UserContext, bool) {
	u, ok := ctx.Value(userContextKey).(*UserContext)
	return u, ok
}

// RequireRole restricts access to endpoints to specific roles only.
func RequireRole(allowedRoles ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user, ok := GetUserFromContext(r.Context())
			if !ok {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			roleAllowed := false
			for _, role := range allowedRoles {
				if user.Role == role {
					roleAllowed = true
					break
				}
			}

			if !roleAllowed {
				http.Error(w, "Forbidden: insufficient permissions", http.StatusForbidden)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
