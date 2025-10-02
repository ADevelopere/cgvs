# GraphQL Authentication

This directory contains the authentication implementation for the GraphQL API.

## Overview

The authentication system uses JWT (JSON Web Tokens) for stateless authentication with the following features:

- **Access Tokens**: Short-lived tokens (15 minutes) for API authentication
- **Refresh Tokens**: Long-lived tokens (7 days) stored in sessions for obtaining new access tokens
- **Session Management**: Server-side session storage in the database
- **Password Hashing**: Using bcryptjs with 12 salt rounds

## Files

- `auth.types.ts` - GraphQL type definitions for User, LoginInput, LoginResponse, etc.
- `auth.query.ts` - GraphQL queries (me)
- `auth.mutation.ts` - GraphQL mutations (login, logout, refreshToken)

## GraphQL Operations

### Mutations

#### Login
```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    refreshToken
    user {
      id
      name
      email
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "email": "user@example.com",
    "password": "password123"
  }
}
```

#### Refresh Token
```graphql
mutation RefreshToken {
  refreshToken {
    token
    user {
      id
      name
      email
    }
  }
}
```

**Note:** The refresh token must be sent in the request headers as `x-refresh-token` or in a cookie named `cgvs_refresh_token`.

#### Logout
```graphql
mutation Logout {
  logout
}
```

**Note:** Requires authentication (access token in Authorization header).

### Queries

#### Get Current User
```graphql
query Me {
  me {
    id
    name
    email
    createdAt
    updatedAt
  }
}
```

**Note:** Requires authentication (access token in Authorization header).

## Client Usage

### 1. Login

```typescript
const { data } = await apolloClient.mutate({
  mutation: LOGIN_MUTATION,
  variables: {
    input: {
      email: 'user@example.com',
      password: 'password123'
    }
  }
});

// Store tokens
const { token, refreshToken } = data.login;
localStorage.setItem('accessToken', token);
localStorage.setItem('refreshToken', refreshToken);
```

### 2. Send Access Token with Requests

Include the access token in the Authorization header:

```typescript
const httpLink = new HttpLink({
  uri: '/api/graphql',
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('accessToken');
  
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });
  
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

### 3. Refresh Access Token

When the access token expires, use the refresh token to get a new one:

```typescript
const { data } = await apolloClient.mutate({
  mutation: REFRESH_TOKEN_MUTATION,
  context: {
    headers: {
      'x-refresh-token': localStorage.getItem('refreshToken'),
    },
  },
});

// Update access token
localStorage.setItem('accessToken', data.refreshToken.token);
```

### 4. Logout

```typescript
await apolloClient.mutate({
  mutation: LOGOUT_MUTATION,
});

// Clear tokens
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
```

## Environment Variables

Make sure to set the following environment variable:

```bash
JWT_SECRET=your-secret-key-change-this-in-production
```

**Important:** Use a strong, random secret in production!

## Authorization

The system supports role-based authorization using the `@pothos/plugin-scope-auth` plugin:

```typescript
// Example: Protect a field for logged-in users only
t.field({
  type: SomeType,
  authScopes: {
    loggedIn: true,
  },
  resolve: async (parent, args, ctx) => {
    // ctx.user will be available here
  },
});

// Example: Protect a field for admin users only
t.field({
  type: SomeType,
  authScopes: {
    admin: true,
  },
  resolve: async (parent, args, ctx) => {
    // Only admins can access this
  },
});

// Example: Protect a field for users with a specific role
t.field({
  type: SomeType,
  authScopes: {
    role: 'moderator',
  },
  resolve: async (parent, args, ctx) => {
    // Only users with 'moderator' role can access this
  },
});
```

## Security Considerations

1. **JWT_SECRET**: Always use a strong, random secret in production
2. **HTTPS**: Use HTTPS in production to protect tokens in transit
3. **Token Storage**: Consider using httpOnly cookies instead of localStorage for better XSS protection
4. **Token Expiration**: Access tokens expire after 15 minutes, refresh tokens after 7 days
5. **Session Cleanup**: Consider implementing a cron job to clean up expired sessions
