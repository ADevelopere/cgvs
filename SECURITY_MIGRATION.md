# Security & HTTP Migration from Ktor to Next.js

This document outlines all security and HTTP features migrated from the Ktor backend to Next.js full-stack application.

## 📋 Migration Summary

All security and HTTP features from your Ktor implementation have been successfully migrated and enhanced in Next.js.

---

## ✅ Implemented Features

### 1. **CORS Configuration** ✅

**Ktor Implementation:**
```kotlin
install(CORS) {
    allowHost("localhost:3000", schemes = listOf("http"))
    allowMethod(HttpMethod.Get)
    allowMethod(HttpMethod.Post)
    // ... other methods
    allowCredentials = true
}
```

**Next.js Implementation:**
- **Location:** `next.config.ts` (global headers) + `app/api/graphql/route.ts` (OPTIONS handler)
- **Features:**
  - Explicit CORS headers for all API routes
  - Credentials support enabled
  - Environment-based origin configuration
  - OPTIONS preflight handler in GraphQL route
  - Max-Age caching (24 hours)

**Configuration:**
```typescript
// In next.config.ts
{
  source: "/api/:path*",
  headers: [
    { key: "Access-Control-Allow-Credentials", value: "true" },
    { key: "Access-Control-Allow-Origin", value: "http://localhost:3000" },
    // ... other CORS headers
  ]
}
```

---

### 2. **Security Headers** ✅

**Ktor Implementation:**
- Configured via Sessions with httpOnly, secure, SameSite

**Next.js Implementation:**
- **Location:** `next.config.ts`
- **Headers Added:**
  - `X-Frame-Options: DENY` - Prevents clickjacking
  - `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
  - `X-XSS-Protection: 1; mode=block` - XSS protection
  - `Strict-Transport-Security` - Forces HTTPS
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` - Restricts browser features
  - `Content-Security-Policy` - Prevents XSS, injection attacks

**CSP Configuration:**
```typescript
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://storage.googleapis.com;
  connect-src 'self' http://localhost:* ws://localhost:*;
  frame-ancestors 'none';
```

---

### 3. **Request Logging** ✅

**Ktor Implementation:**
```kotlin
install(CallLogging) {
    level = Level.INFO
    filter { call ->
        call.application.log.info("Request Content-Type: $contentType")
        true
    }
}
```

**Next.js Implementation:**
- **Location:** `middleware.ts`
- **Features:**
  - Logs all API requests
  - Tracks Content-Type, IP, User-Agent
  - Measures response time
  - Adds request ID to each request
  - Development-friendly logging

**Usage:**
```typescript
export function middleware(request: NextRequest) {
    const start = Date.now();
    logger.log(`[REQUEST] ${method} ${pathname}`);
    // ... processing
    logger.log(`[RESPONSE] - ${response.status} (${Date.now() - start}ms)`);
}
```

---

### 4. **Compression** ✅

**Ktor Implementation:**
```kotlin
install(Compression) {
    gzip { priority = 1.0 }
    deflate { priority = 10.0; minimumSize(1024) }
}
```

**Next.js Implementation:**
- **Location:** `next.config.ts`
- **Configuration:** `compress: true`
- **Note:** Next.js handles compression automatically in production
- GraphQL endpoints are handled correctly by Next.js (no manual exclusion needed)

---

### 5. **Rate Limiting** ✅ NEW!

**Not in Ktor** - New security enhancement!

**Next.js Implementation:**
- **Location:** `server/lib/ratelimit.ts` + `app/api/graphql/route.ts`
- **Technology:** Redis + @upstash/ratelimit
- **Features:**
  - GraphQL API: 100 requests/minute per IP
  - Auth endpoints: 10 requests/15 minutes per IP
  - General API: 200 requests/minute per IP
  - Sliding window algorithm for accuracy
  - Rate limit headers in responses
  - Graceful degradation if Redis is down

**Rate Limiters:**
```typescript
// GraphQL (100/min)
export const graphqlRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 m"),
});

// Auth (10/15min) - prevents brute force
export const authRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "15 m"),
});
```

**Response Headers:**
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Timestamp when limit resets
- `Retry-After`: Seconds to wait (when rate limited)

---

### 6. **Session Management** ✅

**Ktor Implementation:**
```kotlin
install(Sessions) {
    cookie<UserSession>("cgvs_refresh_token") {
        cookie.httpOnly = true
        cookie.maxAgeInSeconds = 7.days.inWholeSeconds
        cookie.extensions["SameSite"] = "Lax"
    }
}
```

**Next.js Implementation:**
- **Location:** `server/graphql/mutation/auth.mutation.ts` (already existed)
- **Features:**
  - httpOnly cookies for refresh tokens
  - 7-day expiration
  - SameSite=Lax for CSRF protection
  - Secure flag in production
  - Session validation in database

**Already Working** - No changes needed, matches Ktor implementation!

---

### 7. **JWT Authentication** ✅

**Ktor Implementation:**
```kotlin
install(Authentication) {
    jwt("auth-jwt") {
        realm = jwtRealm
        verifier(jwtVerifier)
        validate { credential -> JWTPrincipal(credential.payload) }
    }
}
```

**Next.js Implementation:**
- **Location:** `server/graphql/gqlContextFactory.ts` (already existed)
- **Features:**
  - JWT verification on every request
  - Token extraction from Authorization header
  - Context creation with user info
  - Role-based access control

**Already Working** - No changes needed!

---

### 8. **Environment Variable Validation** ✅ NEW!

**Enhanced Security Feature**

**Next.js Implementation:**
- **Location:** `server/lib/env.ts`
- **Features:**
  - Validates JWT_SECRET length (minimum 32 chars in production)
  - Validates DATABASE_URL format
  - Validates REDIS_URL with defaults
  - Auto-validation on server startup
  - Fails fast in production if misconfigured
  - Development-friendly warnings

**Validation:**
```typescript
export function validateEnvironment(): EnvironmentConfig {
    // Validates all critical env vars
    // Exits in production if invalid
}
```

---

## 🐳 Infrastructure

### Redis Setup

**Purpose:** Rate limiting, caching, session storage

**Location:** `containers/redis/`

**Files:**
- `docker-compose.yml` - Container orchestration
- `redis.conf` - Redis configuration
- `README.md` - Usage documentation

**Start Redis:**
```bash
cd containers/redis
docker compose up -d
```

**Configuration:**
- Port: 6379
- Max Memory: 256MB
- Eviction Policy: LRU (Least Recently Used)
- Health checks: Built-in
- Persistence: RDB snapshots

---

## 📂 File Structure

```
/home/pc/Projects/cgsvNew/
├── app/api/graphql/
│   └── route.ts                    # ✅ Updated - Rate limiting + CORS
├── containers/redis/
│   ├── docker-compose.yml          # ✅ New - Redis container
│   ├── redis.conf                  # ✅ New - Redis config
│   └── README.md                   # ✅ New - Documentation
├── middleware.ts                   # ✅ New - Request logging
├── next.config.ts                  # ✅ Updated - CORS + Security headers
├── server/lib/
│   ├── env.ts                      # ✅ New - Env validation
│   ├── ratelimit.ts                # ✅ New - Rate limiting
│   └── index.ts                    # ✅ Updated - Export env
└── server/graphql/
    ├── gqlContext.ts               # ✅ Existing - Working
    └── gqlContextFactory.ts        # ✅ Existing - Working
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file (or use existing):

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cgvs_db

# JWT (IMPORTANT: Change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Redis
REDIS_URL=redis://localhost:6379
REDIS_TOKEN=

# Environment
NODE_ENV=development

# CORS
ALLOWED_ORIGIN=http://localhost:3000
```

### Generate Secure JWT Secret

```bash
# Generate a secure random secret
openssl rand -base64 32
```

---

## 🚀 Usage

### 1. Start Redis

```bash
cd containers/redis
docker compose up -d
```

### 2. Verify Redis

```bash
docker compose ps
docker compose logs -f
```

### 3. Start Application

```bash
bun run dev
```

### 4. Test Rate Limiting

```bash
# Send multiple requests quickly
for i in {1..150}; do
  curl -X POST http://localhost:3000/api/graphql \
    -H "Content-Type: application/json" \
    -d '{"query":"{ __typename }"}'
done

# Should see 429 Too Many Requests after 100 requests
```

### 5. Check Security Headers

```bash
curl -I http://localhost:3000/api/graphql
```

Expected headers:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Content-Security-Policy: ...
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
```

---

## 📊 Comparison Table

| Feature | Ktor | Next.js | Status |
|---------|------|---------|--------|
| CORS | ✅ install(CORS) | ✅ next.config.ts + OPTIONS | ✅ Migrated |
| Security Headers | ⚠️ Partial (Sessions) | ✅ Comprehensive | ✅ Enhanced |
| Request Logging | ✅ CallLogging | ✅ middleware.ts | ✅ Migrated |
| Compression | ✅ gzip/deflate | ✅ Auto (Next.js) | ✅ Migrated |
| JWT Auth | ✅ install(Authentication) | ✅ gqlContextFactory | ✅ Migrated |
| Sessions | ✅ Cookie-based | ✅ Cookie-based | ✅ Migrated |
| Rate Limiting | ❌ Not implemented | ✅ Redis-based | ✅ **NEW!** |
| Env Validation | ⚠️ Basic | ✅ Comprehensive | ✅ **Enhanced!** |
| CSP Headers | ❌ Not implemented | ✅ Implemented | ✅ **NEW!** |
| Health Checks | ⚠️ Basic | ✅ HEAD + OPTIONS | ✅ Enhanced |

---

## 🔒 Security Improvements

### What's Better Than Ktor?

1. **Content Security Policy** - Prevents XSS attacks
2. **Rate Limiting** - Prevents brute force and DDoS
3. **Comprehensive Security Headers** - Defense in depth
4. **Environment Validation** - Fails fast on misconfiguration
5. **Request Monitoring** - Better observability
6. **Rate Limit Headers** - Client-friendly API

---

## 🧪 Testing

### Test CORS

```bash
curl -X OPTIONS http://localhost:3000/api/graphql \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

### Test Rate Limiting

```bash
# Install wrk (load testing tool)
wrk -t2 -c10 -d30s http://localhost:3000/api/graphql
```

### Test Security Headers

```bash
curl -I http://localhost:3000
```

### Test Environment Validation

```bash
# Intentionally set short JWT_SECRET
JWT_SECRET="short" NODE_ENV=production bun run dev
# Should fail with error
```

---

## 📚 Related Documentation

- [AUTH_FLOW.md](./AUTH_FLOW.md) - Complete authentication flow
- [containers/redis/README.md](./containers/redis/README.md) - Redis setup
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
- [@upstash/ratelimit Docs](https://upstash.com/docs/redis/sdks/ratelimit/overview)

---

## 🎯 Production Checklist

Before deploying to production:

- [ ] Set strong `JWT_SECRET` (32+ characters)
- [ ] Configure `ALLOWED_ORIGIN` to production domain
- [ ] Enable `NODE_ENV=production`
- [ ] Set up production Redis instance (not local)
- [ ] Review and tighten CSP rules
- [ ] Enable Redis authentication (`requirepass` in redis.conf)
- [ ] Set up monitoring for rate limit events
- [ ] Configure database connection pooling
- [ ] Review all environment variables
- [ ] Test HTTPS in production (Strict-Transport-Security)

---

## 🔄 Migration Complete!

All Ktor security and HTTP features have been successfully migrated to Next.js with additional enhancements. The application now has:

✅ **Better Security** - CSP, comprehensive headers, rate limiting  
✅ **Better Monitoring** - Request logging, rate limit tracking  
✅ **Better Configuration** - Environment validation, fail-fast startup  
✅ **Better Developer Experience** - Clear errors, helpful warnings

---

## 🆘 Troubleshooting

### Redis Connection Issues

```bash
# Check if Redis is running
docker compose ps

# View Redis logs
docker compose logs -f

# Test Redis connection
redis-cli ping
```

### Rate Limiting Not Working

```bash
# Check Redis connection
echo $REDIS_URL

# Verify Redis is accessible
redis-cli -u redis://localhost:6379 ping
```

### CORS Issues

1. Check `ALLOWED_ORIGIN` environment variable
2. Verify OPTIONS handler is working
3. Check browser console for CORS errors
4. Ensure `credentials: 'include'` in fetch requests

---

**Migration completed successfully!** 🎉

