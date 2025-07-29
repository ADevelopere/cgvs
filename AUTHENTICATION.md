# Authentication Setup

This document describes the authentication and session management setup for the CGSV Ktor application.

## Overview

The application uses a hybrid authentication system with:
- **JWT tokens** for API authentication
- **Database sessions** for session management
- **Session cookies** for web interface authentication
- **GraphQL mutations/queries** for authentication operations

## Features

- User registration and login via GraphQL
- Session-based authentication with database persistence
- JWT token generation for API access
- Password hashing with BCrypt
- Session validation and cleanup
- Role-based access control (Admin/User)

## Authentication Flow

### 1. User Registration/Login
```graphql
mutation {
  login(input: { email: "admin@cgsv.com", password: "admin123" }) {
    token
    user {
      id
      name
      email
      isAdmin
    }
  }
}
```

### 2. Session Management
- Sessions are stored in the database with IP address and user agent
- Session cookies are httpOnly and secure
- Sessions expire after 1 hour of inactivity

### 3. Protected Queries
```graphql
query {
  me {
    id
    name
    email
    isAdmin
  }
}
```

## Configuration

### JWT Settings (application.yaml)
```yaml
postgres:
  secret: "your-super-secret-jwt-key-change-in-production"
  domain: "https://jwt-provider-domain/"
  audience: "jwt-audience"
  realm: "ktor sample app"
```

### Database Tables
- `users`: User information and credentials
- `sessions`: Session data with activity tracking

## Demo User

A default admin user is created during database seeding:
- **Email**: admin@cgsv.com
- **Password**: admin123
- **Role**: Administrator

## GraphQL Endpoints

### Mutations
- `login(input: LoginInput!)`: Authenticate user
- `register(input: RegisterInput!)`: Create new user account
- `logout()`: Invalidate current session

### Queries
- `me()`: Get current user information
- `isAuthenticated()`: Check authentication status
- `users()`: List all users (admin only)
- `user(id: Int!)`: Get user by ID (own profile or admin)

## Security Features

1. **Password Hashing**: BCrypt with salt
2. **Session Validation**: Database-backed session verification
3. **JWT Expiration**: 1-hour token lifetime
4. **Session Cleanup**: Automatic expired session removal
5. **Role-based Access**: Admin and user permissions
6. **CORS Protection**: Configured for frontend integration

## Usage Example

1. Start the application
2. Navigate to GraphQL Playground: `http://localhost:8080/graphql`
3. Login with admin credentials
4. Use the session for subsequent authenticated requests

## API Integration

For frontend applications, you can use either:
- **Session cookies** (automatically handled)
- **JWT tokens** in Authorization header: `Bearer <token>`

## Error Handling

Authentication errors return appropriate HTTP status codes:
- `401 Unauthorized`: Invalid credentials or expired session
- `403 Forbidden`: Insufficient permissions
- `400 Bad Request`: Invalid input data
