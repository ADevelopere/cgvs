# Authentication Flow Documentation

## Overview

This application implements a **secure, industry-standard JWT-based authentication system** using the OAuth2 token pattern with:
- Short-lived access tokens (15 minutes)
- Long-lived refresh tokens (7 days)
- httpOnly cookies for sensitive data
- Token rotation for enhanced security

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT SIDE                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────┐         ┌──────────────────┐                 │
│  │   localStorage   │         │  React Context   │                 │
│  │                  │         │                  │                 │
│  │ - access_token   │◄────────│ - authToken      │                 │
│  │   (15 min)       │         │ - user           │                 │
│  └──────────────────┘         │ - isAuthenticated│                 │
│                                └──────────────────┘                 │
│                                        │                             │
│                                        ▼                             │
│                          ┌──────────────────────┐                   │
│                          │  Apollo Client       │                   │
│                          │  (GraphQL)           │                   │
│                          │                      │                   │
│                          │  + Auth Link         │                   │
│                          │    (adds Bearer)     │                   │
│                          └──────────────────────┘                   │
│                                        │                             │
└────────────────────────────────────────┼─────────────────────────────┘
                                         │
                    HTTP Request with:   │
                    - Authorization: Bearer <access_token>
                    - Cookie: cgvs_session_id=xxx
                    - Cookie: cgvs_refresh_token=xxx
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           SERVER SIDE                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Next.js API Route Handler                       │  │
│  │              /app/api/graphql/route.ts                       │  │
│  └──────────────────────┬───────────────────────────────────────┘  │
│                         │                                            │
│                         ▼                                            │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │           Context Factory                                     │  │
│  │           gqlContextFactory.ts                                │  │
│  │                                                                │  │
│  │  1. Extract access token from Authorization header           │  │
│  │  2. Extract refresh token from cookie                        │  │
│  │  3. Extract session ID from cookie                           │  │
│  │  4. Verify access token JWT                                  │  │
│  │  5. Create context with user info                            │  │
│  └──────────────────────┬───────────────────────────────────────┘  │
│                         │                                            │
│                         ▼                                            │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │           GraphQL Resolvers                                   │  │
│  │           auth.query.ts / auth.mutation.ts                    │  │
│  │                                                                │  │
│  │  Queries:                  Mutations:                         │  │
│  │  - me                      - login                            │  │
│  │  - user                    - refreshToken                     │  │
│  │  - users                   - logout                           │  │
│  └──────────────────────┬───────────────────────────────────────┘  │
│                         │                                            │
│                         ▼                                            │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Database (Drizzle ORM)                           │  │
│  │                                                                │  │
│  │  Tables:                                                      │  │
│  │  - users (id, email, password hash, name)                    │  │
│  │  - sessions (id, userId, payload, lastActivity)              │  │
│  │  - roles, userRoles                                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Flow Diagrams

### 1. Login Flow

```
CLIENT                                    SERVER
  │                                         │
  │  1. User submits credentials            │
  │  ──────────────────────────────────────►│
  │     POST /api/graphql                   │
  │     mutation { login(                   │
  │       email: "user@example.com"         │
  │       password: "password123"           │
  │     )}                                  │
  │                                         │
  │                                    2. Validate credentials
  │                                         │
  │                                    3. Generate tokens:
  │                                       - accessToken (JWT, 15min)
  │                                       - refreshToken (JWT, 7d)
  │                                         │
  │                                    4. Create session in DB:
  │                                       - sessionId (UUID)
  │                                       - userId
  │                                       - metadata
  │                                       - lastActivity
  │                                         │
  │                                    5. Set httpOnly cookies:
  │                                       - cgvs_session_id
  │                                       - cgvs_refresh_token
  │                                         │
  │  ◄──────────────────────────────────────│
  │  6. Response:                           │
  │     {                                   │
  │       token: "eyJhbGc...",             │
  │       user: { id, name, email }        │
  │     }                                   │
  │     Set-Cookie: cgvs_session_id=...    │
  │     Set-Cookie: cgvs_refresh_token=... │
  │                                         │
  │  7. Store access token in localStorage │
  │     localStorage.setItem(               │
  │       'cgsv_access_token',              │
  │       token                             │
  │     )                                   │
  │                                         │
  │  8. Update React state:                │
  │     - setUser(user)                    │
  │     - setIsAuthenticated(true)         │
  │     - setAuthToken(token)              │
  │                                         │
  │  9. Redirect to dashboard              │
  │                                         │
```

### 2. Authenticated Request Flow

```
CLIENT                                    SERVER
  │                                         │
  │  1. User performs action                │
  │     (e.g., fetch templates)             │
  │                                         │
  │  2. Apollo Client intercepts            │
  │     Adds Authorization header:          │
  │     Bearer <access_token>               │
  │                                         │
  │  3. Browser automatically adds cookies  │
  │  ──────────────────────────────────────►│
  │     GET /api/graphql                    │
  │     Authorization: Bearer eyJhbGc...    │
  │     Cookie: cgvs_session_id=...         │
  │     Cookie: cgvs_refresh_token=...      │
  │                                         │
  │                                    4. Context Factory:
  │                                       - Extract access token
  │                                       - Verify JWT signature
  │                                       - Decode payload
  │                                       - Load user from DB
  │                                         │
  │                                    5. Create context:
  │                                       ctx.user = { id: 123 }
  │                                       ctx.roles = ['admin']
  │                                         │
  │                                    6. Execute resolver:
  │                                       - Check authScopes
  │                                       - Run business logic
  │                                       - Query database
  │                                         │
  │  ◄──────────────────────────────────────│
  │  7. Response with data                  │
  │     {                                   │
  │       data: { templates: [...] }       │
  │     }                                   │
  │                                         │
  │  8. Update UI with data                │
  │                                         │
```

### 3. Token Refresh Flow

```
CLIENT                                    SERVER
  │                                         │
  │  1. Access token expires (15 min)      │
  │                                         │
  │  2. API request fails with 401         │
  │  ◄──────────────────────────────────────│
  │     {                                   │
  │       errors: [{                        │
  │         extensions: {                   │
  │           code: "UNAUTHENTICATED"      │
  │         }                               │
  │       }]                                │
  │     }                                   │
  │                                         │
  │  3. Error interceptor detects 401      │
  │                                         │
  │  4. Call refreshToken mutation         │
  │  ──────────────────────────────────────►│
  │     POST /api/graphql                   │
  │     mutation { refreshToken }           │
  │     Cookie: cgvs_session_id=...         │
  │     Cookie: cgvs_refresh_token=...      │
  │                                         │
  │                                    5. Validate cookies:
  │                                       - Check session exists
  │                                       - Verify refresh token JWT
  │                                       - Check user still active
  │                                         │
  │                                    6. Generate NEW tokens:
  │                                       - New accessToken (15min)
  │                                       - New refreshToken (7d)
  │                                       (Token Rotation!)
  │                                         │
  │                                    7. Update session:
  │                                       - lastActivity = now
  │                                         │
  │                                    8. Set NEW cookies:
  │                                       - cgvs_refresh_token (new)
  │                                         │
  │  ◄──────────────────────────────────────│
  │  9. Response:                           │
  │     {                                   │
  │       token: "eyJhbGc...",  (NEW)      │
  │       user: { id, name, email }        │
  │     }                                   │
  │     Set-Cookie: cgvs_refresh_token=... │
  │                                         │
  │  10. Update localStorage with new token│
  │      localStorage.setItem(              │
  │        'cgsv_access_token',             │
  │        newToken                         │
  │      )                                  │
  │                                         │
  │  11. Retry original request            │
  │      with new access token             │
  │                                         │
```

### 4. Logout Flow

```
CLIENT                                    SERVER
  │                                         │
  │  1. User clicks logout                 │
  │                                         │
  │  2. Call logout mutation               │
  │  ──────────────────────────────────────►│
  │     POST /api/graphql                   │
  │     mutation { logout }                 │
  │     Authorization: Bearer <token>       │
  │     Cookie: cgvs_session_id=...         │
  │                                         │
  │                                    3. Delete sessions:
  │                                       DELETE FROM sessions
  │                                       WHERE userId = ctx.user.id
  │                                         │
  │                                    4. Clear cookies:
  │                                       cookies.delete(
  │                                         'cgvs_session_id'
  │                                       )
  │                                       cookies.delete(
  │                                         'cgvs_refresh_token'
  │                                       )
  │                                         │
  │  ◄──────────────────────────────────────│
  │  5. Response: true                      │
  │     Set-Cookie: cgvs_session_id=;      │
  │                 expires=Thu, 01 Jan... │
  │     Set-Cookie: cgvs_refresh_token=;   │
  │                 expires=Thu, 01 Jan... │
  │                                         │
  │  6. Clear client state:                │
  │     - localStorage.clear()             │
  │     - setUser(null)                    │
  │     - setIsAuthenticated(false)        │
  │     - setAuthToken(null)               │
  │                                         │
  │  7. Hard redirect to /login            │
  │     window.location.href = "/login"    │
  │                                         │
```

---

## Why This Design is Good

### 🔒 Security Benefits

#### 1. **Defense in Depth - Multiple Security Layers**

```
Layer 1: Access Token (15 min)
├─ Short-lived: Limits exposure window
├─ JWT signed: Cannot be tampered with
└─ Used for every request: Validates user constantly

Layer 2: Refresh Token (7 days)
├─ httpOnly cookie: JavaScript cannot access
├─ Secure flag: HTTPS only in production
├─ SameSite: lax: CSRF protection
└─ Token rotation: Changes on every refresh

Layer 3: Session Database
├─ Tracks all active sessions
├─ Can invalidate sessions server-side
├─ Monitors last activity
└─ Enables security auditing

Layer 4: Password Security
├─ Bcrypt hashing: Slow, secure
├─ Salt per password: No rainbow tables
└─ Never exposed: Password not in responses
```

#### 2. **XSS Attack Mitigation**

**If XSS attack occurs:**

```
✅ PROTECTED:
- Refresh token (httpOnly cookie - JS cannot read)
- Session ID (httpOnly cookie - JS cannot read)
- Password (never sent to client)

⚠️ VULNERABLE (but limited):
- Access token (in localStorage)
  → But only valid for 15 minutes
  → Refresh token can't be stolen, so no long-term access
  → Token rotation means attacker can't maintain access
```

**Impact: LOW**
- Attacker window: 15 minutes maximum
- No long-term compromise possible
- Session can be invalidated server-side

#### 3. **Token Compromise Scenarios**

| Scenario | Impact | Mitigation |
|----------|--------|------------|
| Access token stolen | LOW | Expires in 15 minutes |
| Refresh token stolen | MEDIUM | Rotation detects reuse, httpOnly prevents XSS theft |
| Database compromised | HIGH | Passwords are bcrypt hashed, sessions can be cleared |
| Session hijacked | LOW-MEDIUM | Token rotation, session validation, activity tracking |

#### 4. **Token Rotation (Refresh Token)**

**Why it matters:**
```
Without Rotation:
- Refresh token valid for 7 days
- If stolen once, attacker has 7-day access
- No detection mechanism

With Rotation:
- New refresh token on every refresh
- Old token becomes invalid
- If attacker uses old token → detected!
- Legitimate user gets new token → attacker locked out
```

**Implementation:**
```typescript
// Every refresh generates NEW refresh token
const newRefreshToken = await generateRefreshToken(user.id, user.email);

// Old token in cookie is replaced
ctx.cookies.set("cgvs_refresh_token", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
});
```

---

### ⚡ Performance Benefits

#### 1. **Reduced Database Queries**

```
Without JWT:
Every request → Query database for user
1000 requests → 1000 database queries

With JWT:
Login → Query database for user → Create JWT
999 requests → Verify JWT (no database!)
Token refresh → Query database → Create new JWT
```

**Result:** ~99% reduction in auth-related database queries

#### 2. **Stateless Authentication**

```
Access Token is Self-Contained:
{
  "userId": 123,
  "email": "user@example.com",
  "type": "access",
  "iat": 1696521600,
  "exp": 1696522500
}

Benefits:
✅ No session lookup for every request
✅ Works across multiple servers (horizontal scaling)
✅ Fast verification (cryptographic signature)
✅ Can be cached at edge (CDN)
```

#### 3. **Optimized Token Refresh**

```
Smart Refresh Strategy:
- Check token expiry client-side
- Refresh proactively (before expiry)
- Batch multiple failed requests
- Single refresh for multiple tabs (shared localStorage)

Result:
- Minimal user disruption
- Reduced server load
- Better UX (no auth interruptions)
```

---

### 🎯 User Experience Benefits

#### 1. **Seamless Experience**

```
User Actions:
1. Login once → Stay logged in for 7 days
2. Close browser → Still logged in on return
3. Refresh page → No re-authentication needed
4. Multiple tabs → Shared authentication state
5. Token expires → Auto-refresh (invisible to user)
```

#### 2. **Fast Authentication**

```
Login:
- Single API call
- Cookies set automatically by browser
- No complex session management

Subsequent Requests:
- Instant (JWT verification ~1ms)
- No database lookups
- No session server needed
```

#### 3. **Robust Error Handling**

```
Token Expired:
→ Auto-refresh attempt
→ If successful: Continue seamlessly
→ If failed: Redirect to login

Network Error:
→ Retry with exponential backoff
→ Show connection status
→ Queue requests for when online

Concurrent Requests:
→ Single refresh for multiple 401s
→ Other requests wait for refresh
→ All retry with new token
```

---

### 🏗️ Scalability Benefits

#### 1. **Horizontal Scaling**

```
Traditional Session-Based:
┌─────────┐     ┌─────────┐
│ Server1 │────▶│ Session │
│         │     │  Store  │
└─────────┘     │(Redis)  │
┌─────────┐     │         │
│ Server2 │────▶│         │
│         │     └─────────┘
└─────────┘
- Single point of failure
- Network latency to session store
- Scaling complexity

JWT-Based (Current):
┌─────────┐
│ Server1 │ → Verifies JWT locally
│         │    (No external dependency)
└─────────┘
┌─────────┐
│ Server2 │ → Verifies JWT locally
│         │    (No external dependency)
└─────────┘
- No shared state needed
- Add servers without configuration
- Edge deployment possible
```

#### 2. **Database Efficiency**

```
Sessions Table:
- Only created on login/refresh
- Cleaned up on logout
- Used for security (revocation)
- NOT queried on every request

Result:
- Minimal database load
- Can scale to millions of users
- Fast response times
```

#### 3. **CDN & Edge Compatibility**

```
Static Assets:
- JWT verification can happen at edge
- No origin server needed for auth check
- Faster response times globally

API Routes:
- GraphQL endpoint can be cached
- Auth headers standardized
- Works with Next.js edge functions
```

---

### 🔧 Maintainability Benefits

#### 1. **Clear Separation of Concerns**

```
Client Responsibilities:
- Store access token
- Attach to requests
- Handle token refresh
- Clear on logout

Server Responsibilities:
- Validate credentials
- Generate tokens
- Manage sessions
- Enforce authorization

Database Responsibilities:
- Store users & passwords
- Track sessions
- Enable auditing
```

#### 2. **Industry Standard Pattern**

```
Used By:
- Google OAuth
- GitHub
- Auth0
- AWS Cognito
- Firebase Auth
- Microsoft Azure AD

Benefits:
- Well documented
- Known security properties
- Community support
- Familiar to developers
- Audited by security experts
```

#### 3. **Easy to Extend**

```
Future Enhancements:
✅ Add OAuth providers (Google, GitHub)
✅ Implement MFA (store in session payload)
✅ Add device management (track in sessions)
✅ Implement role-based permissions (in JWT claims)
✅ Add API rate limiting (by user ID in token)
✅ Enable audit logging (from JWT claims)
```

---

## Security Best Practices Implemented

### ✅ Implemented

- [x] **httpOnly cookies** for refresh tokens (XSS protection)
- [x] **Short-lived access tokens** (15 minutes)
- [x] **Token rotation** on refresh (theft detection)
- [x] **Secure password hashing** (bcrypt)
- [x] **JWT signature verification** (tamper protection)
- [x] **SameSite cookie attribute** (CSRF protection)
- [x] **Session invalidation** on logout
- [x] **Separation of concerns** (access vs refresh tokens)
- [x] **Environment variable validation** (JWT_SECRET required in production)

### 🔄 Recommended Future Enhancements

- [ ] **Content Security Policy (CSP)** headers
- [ ] **Rate limiting** on auth endpoints
- [ ] **Account lockout** after failed attempts
- [ ] **Device fingerprinting** for sessions
- [ ] **IP address validation** (optional)
- [ ] **Audit logging** for security events
- [ ] **MFA support** (TOTP/SMS)
- [ ] **Session management UI** (view/revoke devices)
- [ ] **Suspicious activity detection**
- [ ] **Password strength requirements**

---

## Configuration

### Environment Variables

```bash
# Required in production
JWT_SECRET=<random-256-bit-secret>

# Optional
NODE_ENV=production
DATABASE_URL=postgresql://...
```

### Token Lifetimes

```typescript
// server/graphql/auth/jwt.ts
const JWT_ACCESS_TOKEN_EXPIRY = '15m';  // Access token
const JWT_REFRESH_TOKEN_EXPIRY = '7d';  // Refresh token

// Can be adjusted based on security requirements
```

### Cookie Settings

```typescript
// server/graphql/auth/auth.mutation.ts
ctx.cookies.set("cgvs_refresh_token", refreshToken, {
    httpOnly: true,              // XSS protection
    secure: NODE_ENV === "production", // HTTPS only
    sameSite: "lax",            // CSRF protection
    maxAge: 60 * 60 * 24 * 7,   // 7 days
    path: "/",                  // Available site-wide
});
```

---

## Testing Recommendations

### Security Testing

```bash
# Test XSS protection
- Attempt to read cookies via document.cookie
- Verify refresh token is NOT accessible

# Test token expiration
- Wait 15 minutes
- Verify access token rejected
- Verify refresh works

# Test token rotation
- Call refresh multiple times
- Verify old refresh tokens are invalid

# Test logout
- Logout
- Verify cookies cleared
- Verify tokens rejected
```

### Performance Testing

```bash
# Test JWT verification speed
- Measure time to verify 1000 tokens
- Should be < 1ms per token

# Test concurrent refresh
- Multiple tabs refresh simultaneously
- Verify race conditions handled

# Test database load
- Monitor queries during 1000 requests
- Verify auth queries minimal
```

---

## Related Files

### Server-Side
- `server/graphql/auth/auth.mutation.ts` - Login, refresh, logout
- `server/graphql/auth/auth.query.ts` - User queries
- `server/graphql/auth/jwt.ts` - Token generation/verification
- `server/graphql/auth/password.ts` - Password hashing
- `server/graphql/auth/session.repository.ts` - Session management
- `server/graphql/auth/user.repository.ts` - User database queries
- `server/graphql/gqlContext.ts` - GraphQL context types
- `server/graphql/gqlContextFactory.ts` - Context creation
- `app/api/graphql/route.ts` - Next.js API route

### Client-Side
- `client/contexts/AuthContext.tsx` - Authentication state
- `client/contexts/AppApolloProvider.tsx` - Apollo client setup
- `client/utils/auth.ts` - Auth utilities
- `client/components/ProtectedRoute.tsx` - Route guards

---

## Conclusion

This authentication system provides:

✅ **Security**: Multiple layers of protection, industry-standard patterns  
✅ **Performance**: Fast JWT verification, minimal database load  
✅ **UX**: Seamless experience, auto-refresh, persistent sessions  
✅ **Scalability**: Stateless tokens, horizontal scaling ready  
✅ **Maintainability**: Clear separation, well-documented, extensible  

It follows OAuth2/JWT best practices and is used by major companies worldwide. The combination of short-lived access tokens and httpOnly refresh tokens provides the optimal balance between security and user experience.
