# Security Hardening Plan

**Document Version:** 1.0  
**Date:** October 10, 2025  
**Status:** Planning Phase  
**Priority:** High

## Executive Summary

This document outlines a comprehensive security hardening plan for the Next.js full-stack application. The plan addresses 13 critical security areas identified during security audit and provides actionable remediation steps with priority levels and estimated effort.

---

## Table of Contents

1. [Authentication & Session Management](#1-authentication--session-management)
2. [GraphQL API Security](#2-graphql-api-security)
3. [CORS & CSP Configuration](#3-cors--csp-configuration)
4. [Rate Limiting Enhancement](#4-rate-limiting-enhancement)
5. [Database Security](#5-database-security)
6. [File Upload/Storage Security](#6-file-uploadstorage-security)
7. [Redis Security](#7-redis-security)
8. [Environment Variable Protection](#8-environment-variable-protection)
9. [Email/Phone Validation](#9-emailphone-validation)
10. [Logging & Information Disclosure](#10-logging--information-disclosure)
11. [Dependency Management](#11-dependency-management)
12. [SSRF Prevention](#12-ssrf-prevention)
13. [Business Logic Security](#13-business-logic-security)

---

## 1. Authentication & Session Management

### Priority: 🔴 **CRITICAL**

### Estimated Effort: **3-5 days**

### Current Issues

- Weak default JWT secret in development
- Insecure cookie configuration
- No session rotation after login
- Potential token expiration issues

### Remediation Steps

#### 1.1 Secure JWT Configuration

**File:** `server/lib/auth/jwt.ts`

```typescript
// Add these configurations:
- Minimum secret length: 64 characters in production
- Access token expiry: 15 minutes
- Refresh token expiry: 7 days
- Token rotation on refresh
- Blacklist mechanism for revoked tokens
```

**Action Items:**

- [ ] Generate strong JWT secrets (use `openssl rand -base64 64`)
- [ ] Implement token expiration validation
- [ ] Add token rotation logic
- [ ] Create token blacklist in Redis with TTL
- [ ] Add JWT signature algorithm verification (RS256 preferred)

#### 1.2 Secure Cookie Configuration

**File:** `app/api/graphql/route.ts`, `server/graphql/gqlContextFactory.ts`

```typescript
// Update cookie settings:
const cookieOptions = {
  httpOnly: true, // Prevent XSS access
  secure: process.env.NODE_ENV === "production", // HTTPS only
  sameSite: "strict", // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
  domain: process.env.COOKIE_DOMAIN, // Restrict domain
};
```

**Action Items:**

- [ ] Update all cookie-setting code with secure options
- [ ] Implement cookie prefixes (`__Host-` or `__Secure-`)
- [ ] Add cookie signing/encryption
- [ ] Document cookie security in AUTH_FLOW.md

#### 1.3 Session Management

**New File:** `server/lib/auth/session.ts`

**Action Items:**

- [ ] Implement session rotation on login
- [ ] Add session invalidation on logout
- [ ] Create concurrent session limits (max 3 devices)
- [ ] Add session activity tracking
- [ ] Implement "logout all devices" functionality
- [ ] Add suspicious activity detection (location, device changes)

#### 1.4 Multi-Factor Authentication (MFA)

**New Files:** `server/lib/auth/mfa.ts`, `server/lib/auth/totp.ts`

**Action Items:**

- [ ] Implement TOTP-based 2FA
- [ ] Add backup codes generation
- [ ] Create MFA enrollment flow
- [ ] Add MFA verification in authentication
- [ ] Store MFA secrets encrypted in database

---

## 2. GraphQL API Security

### Priority (API): 🔴 **CRITICAL**

### Estimated Effort: **4-6 days**

### Current Issues (API)

- No query complexity/depth limiting
- Introspection might be enabled in production
- Batch query attacks possible
- Missing field-level authorization

### Remediation Steps (API)

#### 2.1 Query Complexity & Depth Limiting

**File:** `app/api/graphql/route.ts`

**Action Items:**

- [ ] Install `graphql-depth-limit` package
- [ ] Install `graphql-query-complexity` package
- [ ] Set max query depth: 7 levels
- [ ] Set max query complexity: 1000 points
- [ ] Configure cost analysis per field
- [ ] Add complexity headers to responses

**Implementation:**

```typescript
import depthLimit from "graphql-depth-limit";
import { createComplexityLimitRule } from "graphql-validation-complexity";

const server = new ApolloServer({
  schema: graphQLSchema,
  validationRules: [
    depthLimit(7),
    createComplexityLimitRule(1000, {
      onCost: cost => {
        logger.log(`Query cost: ${cost}`);
      },
    }),
  ],
});
```

#### 2.2 Disable Introspection in Production

**File:** `app/api/graphql/route.ts`

**Action Items:**

- [ ] Disable introspection in production
- [ ] Create separate admin endpoint for schema access
- [ ] Add authentication to schema endpoint
- [ ] Document schema elsewhere for developers

**Implementation:**

```typescript
const server = new ApolloServer({
  schema: graphQLSchema,
  introspection: process.env.NODE_ENV !== "production",
});
```

#### 2.3 Query Batching Protection

**File:** `app/api/graphql/route.ts`

**Action Items:**

- [ ] Limit batch size to 5 operations
- [ ] Apply rate limiting per operation in batch
- [ ] Add batch operation logging
- [ ] Consider disabling batching for public endpoints

#### 2.4 Field-Level Authorization

**File:** `server/graphql/pothos/*`

**Action Items:**

- [ ] Audit all resolvers for authorization
- [ ] Implement field-level auth directives
- [ ] Add `@auth` decorator for protected fields
- [ ] Create permission matrix document
- [ ] Add role-based access control (RBAC)
- [ ] Implement data filtering based on user permissions

**New File:** `server/graphql/directives/auth.ts`

```typescript
// Create custom directives:
- @requireAuth
- @requireRole(roles: [ADMIN, USER])
- @requirePermission(permission: String)
```

#### 2.5 Input Validation & Sanitization

**New File:** `server/graphql/validators/input.ts`

**Action Items:**

- [ ] Install `validator` and `sanitize-html` packages
- [ ] Create input validation middleware
- [ ] Sanitize all string inputs
- [ ] Add max length constraints
- [ ] Validate email, phone, URL formats
- [ ] Prevent SQL injection in raw queries
- [ ] Add regex validation for specific fields

---

## 3. CORS & CSP Configuration

### Priority: 🟡 **HIGH**

### Estimated Effort: **1-2 days**

### Current Issues ( CORS & CSP)

- `unsafe-eval` and `unsafe-inline` in CSP
- `localhost:*` in production CSP
- Hardcoded origin fallback

### Remediation Steps ( CORS & CSP)

#### 3.1 Fix Content Security Policy

**File:** `next.config.ts`

**Action Items:**

- [ ] Remove `unsafe-eval` and `unsafe-inline`
- [ ] Implement nonce-based CSP for scripts
- [ ] Remove localhost from production CSP
- [ ] Add report-uri for CSP violations
- [ ] Use environment-specific CSP configs

**Updated CSP:**

```typescript
const cspHeader = `
  default-src 'self';
  script-src 'self' 'nonce-{NONCE}';
  style-src 'self' 'nonce-{NONCE}';
  img-src 'self' data: https://storage.googleapis.com;
  font-src 'self' data:;
  connect-src 'self' ${process.env.API_URL};
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
  report-uri /api/csp-report;
`;
```

#### 3.2 Dynamic Nonce Generation

**New File:** `middleware.ts` (update)

**Action Items:**

- [ ] Generate unique nonce per request
- [ ] Inject nonce into CSP header
- [ ] Pass nonce to React components
- [ ] Update all inline scripts to use nonce

#### 3.3 CORS Configuration

**File:** `next.config.ts`, `app/api/graphql/route.ts`

**Action Items:**

- [ ] Use environment variable for allowed origins
- [ ] Implement origin whitelist
- [ ] Add validation for CORS origins
- [ ] Remove hardcoded fallback domains
- [ ] Add CORS preflight caching

#### 3.4 CSP Violation Reporting

**New File:** `app/api/csp-report/route.ts`

**Action Items:**

- [ ] Create CSP report endpoint
- [ ] Log violations to monitoring service
- [ ] Alert on repeated violations
- [ ] Analyze violations for policy refinement

---

## 4. Rate Limiting Enhancement

### Priority (Rate Limiting): 🟡 **HIGH**

### Estimated Effort: **2-3 days**

### Current Issues (Rate Limiting)

- Fail-open strategy when Redis is down
- IP-based only (proxy bypass)
- 100 req/min might be too generous

### Remediation Steps (Rate Limiting)

#### 4.1 Fail-Closed Strategy

**File:** `server/lib/ratelimit.ts`

**Action Items:**

- [ ] Implement fail-closed for authentication endpoints
- [ ] Add in-memory fallback rate limiter
- [ ] Create circuit breaker for Redis
- [ ] Add health check endpoint
- [ ] Monitor Redis availability

#### 4.2 Multi-Factor Rate Limiting

**File:** `server/lib/ratelimit.ts` (update)

**Action Items:**

- [ ] Combine IP + User ID for authenticated requests
- [ ] Add fingerprint-based rate limiting
- [ ] Implement different limits per user tier
- [ ] Add endpoint-specific rate limits
- [ ] Create exemption list for trusted IPs

**Implementation:**

```typescript
// Hybrid identifier
function getIdentifier(request: Request, userId?: number): string {
  const ip = getClientIdentifier(request);
  const fingerprint = request.headers.get("x-fingerprint");

  if (userId) {
    return `user:${userId}`;
  }

  if (fingerprint) {
    return `fp:${fingerprint}:${ip}`;
  }

  return `ip:${ip}`;
}
```

#### 4.3 Stricter Limits

**File:** `server/lib/ratelimit.ts`

**Action Items:**

- [ ] Reduce GraphQL rate limit: 50 req/min
- [ ] Auth endpoints: 5 attempts per 15 min
- [ ] Add progressive delays (exponential backoff)
- [ ] Implement CAPTCHA after multiple failures
- [ ] Add IP blocking for repeat offenders

#### 4.4 Distributed Rate Limiting

**File:** `server/lib/ratelimit.ts`

**Action Items:**

- [ ] Ensure Redis Cluster compatibility
- [ ] Add rate limit synchronization across instances
- [ ] Implement sliding window algorithm correctly
- [ ] Add rate limit analytics
- [ ] Create admin dashboard for rate limits

---

## 5. Database Security

### Priority (Database): 🟡 **HIGH**

### Estimated Effort: **3-4 days**

### Current Issues (Database)

- Potential SQL injection in raw queries
- No Row-Level Security
- Mass assignment vulnerabilities
- Connection string exposure

### Remediation Steps (Database)

#### 5.1 SQL Injection Prevention

**Files:** `server/db/repo/*`

**Action Items:**

- [ ] Audit all database queries
- [ ] Remove any raw SQL with string interpolation
- [ ] Use parameterized queries only
- [ ] Add query logging in development
- [ ] Implement query review process
- [ ] Use Drizzle query builder exclusively

#### 5.2 Input Validation

**New File:** `server/db/validators.ts`

**Action Items:**

- [ ] Create schema validators for all inputs
- [ ] Add Zod schemas for GraphQL inputs
- [ ] Validate data types before DB operations
- [ ] Implement whitelist for allowed fields
- [ ] Add max length constraints
- [ ] Validate foreign key relationships

#### 5.3 Row-Level Security (RLS)

**File:** `server/db/drizzleDb.ts`

**Action Items:**

- [ ] Implement RLS policies in PostgreSQL
- [ ] Add tenant isolation
- [ ] Create user-specific views
- [ ] Add userId checks in all queries
- [ ] Implement soft deletes
- [ ] Add audit trail for sensitive tables

**SQL Implementation:**

```sql
-- Enable RLS on tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY user_isolation_policy ON students
  USING (user_id = current_setting('app.user_id')::int);
```

#### 5.4 Connection Security

**File:** `server/db/drizzleDb.ts`

**Action Items:**

- [ ] Use SSL for database connections
- [ ] Implement connection pooling limits
- [ ] Add connection timeout
- [ ] Use read-only connections for queries
- [ ] Rotate database credentials regularly
- [ ] Store credentials in secrets manager

#### 5.5 Database Encryption

**New File:** `server/db/encryption.ts`

**Action Items:**

- [ ] Encrypt sensitive fields (email, phone)
- [ ] Implement column-level encryption
- [ ] Use AES-256 for encryption
- [ ] Store encryption keys in KMS
- [ ] Add encrypted field helpers
- [ ] Document encrypted columns

---

## 6. File Upload/Storage Security

### Priority (Storage): 🟡 **HIGH**

### Estimated Effort (Storage): **2-3 days**

### Current Issues (Storage)

- Unrestricted file uploads
- Path traversal vulnerabilities
- Malicious file execution
- Public file access

### Remediation Steps (Storage)

#### 6.1 File Upload Validation

**File:** `server/storage/storage.service.ts`

**Action Items:**

- [ ] Implement file type whitelist (MIME validation)
- [ ] Add file size limits (10MB default)
- [ ] Validate file extensions
- [ ] Check magic bytes for file type verification
- [ ] Scan files with antivirus (ClamAV)
- [ ] Reject executable file types
- [ ] Add image dimension limits

**Implementation:**

```typescript
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "application/pdf"];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
```

#### 6.2 Path Traversal Prevention

**File:** `server/storage/disk/*.ts`

**Action Items:**

- [ ] Sanitize all filenames
- [ ] Use UUID for file storage names
- [ ] Validate file paths
- [ ] Prevent directory traversal (../)
- [ ] Store files outside web root
- [ ] Add path canonicalization

#### 6.3 Secure File Serving

**New File:** `app/api/files/[id]/route.ts`

**Action Items:**

- [ ] Require authentication for file access
- [ ] Implement authorization checks
- [ ] Add download rate limiting
- [ ] Set proper Content-Type headers
- [ ] Add Content-Disposition for downloads
- [ ] Implement signed URLs with expiration
- [ ] Add watermarking for sensitive images

#### 6.4 SVG Sanitization

**New File:** `server/storage/sanitizers/svg.ts`

**Action Items:**

- [ ] Install `dompurify` or `svg-sanitizer`
- [ ] Remove script tags from SVGs
- [ ] Strip event handlers
- [ ] Validate SVG structure
- [ ] Consider converting to PNG

---

## 7. Redis Security

### Priority: 🟠 **MEDIUM**

### Estimated Effort (Redis): **1-2 days**

### Current Issues (Redis)

- No Redis authentication
- Unencrypted session data
- No command restrictions

### Remediation Steps (Redis)

#### 7.1 Redis Authentication

**File:** `containers/redis/redis.conf`, `server/services/redis/*.ts`

**Action Items:**

- [ ] Enable Redis AUTH
- [ ] Set strong Redis password
- [ ] Use ACL for command restrictions
- [ ] Disable dangerous commands (FLUSHALL, CONFIG)
- [ ] Use TLS for Redis connections
- [ ] Restrict Redis network access

**Redis Config:**

```conf
# redis.conf
requirepass YOUR_STRONG_PASSWORD_HERE
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG ""
maxmemory 256mb
maxmemory-policy allkeys-lru
```

#### 7.2 Data Encryption

**New File:** `server/services/redis/encryption.ts`

**Action Items:**

- [ ] Encrypt sensitive data before storing
- [ ] Implement AES-256-GCM encryption
- [ ] Add key rotation mechanism
- [ ] Encrypt session data
- [ ] Hash PII before using as keys

#### 7.3 Redis Monitoring

**File:** `server/services/redis/*.ts`

**Action Items:**

- [ ] Add Redis connection health checks
- [ ] Monitor Redis memory usage
- [ ] Alert on connection failures
- [ ] Track slow queries
- [ ] Implement Redis Sentinel for HA

---

## 8. Environment Variable Protection

### Priority (.env): 🟠 **MEDIUM**

### Estimated Effort: **1 day**

### Current Issues (.env)

- Logging might expose secrets
- Client-side env leakage
- No secret rotation

### Remediation Steps (.env)

#### 8.1 Secret Management

**New File:** `server/lib/secrets.ts`

**Action Items:**

- [ ] Use secrets manager (AWS Secrets Manager, Vault)
- [ ] Implement secret rotation
- [ ] Add secret versioning
- [ ] Remove secrets from .env files
- [ ] Use encrypted .env files locally
- [ ] Add pre-commit hooks to prevent secret commits

#### 8.2 Logging Safety

**File:** `server/lib/env.ts`, `lib/logger.ts`

**Action Items:**

- [ ] Remove secret logging entirely
- [ ] Implement log sanitization
- [ ] Redact sensitive patterns (emails, tokens)
- [ ] Use structured logging
- [ ] Add log levels (DEBUG, INFO, WARN, ERROR)
- [ ] Send logs to secure aggregation service

#### 8.3 Client-Side Protection

**File:** `next.config.ts`

**Action Items:**

- [ ] Audit NEXT*PUBLIC* variables
- [ ] Remove unnecessary public vars
- [ ] Use server-side config injection
- [ ] Add webpack plugin to strip secrets
- [ ] Monitor bundle for leaked secrets

#### 8.4 Secret Scanning

**New File:** `.github/workflows/secret-scan.yml`

**Action Items:**

- [ ] Install `trufflehog` or `gitleaks`
- [ ] Run secret scanning in CI/CD
- [ ] Add pre-commit hooks
- [ ] Scan git history for leaks
- [ ] Rotate any found secrets immediately

---

## 9. Email/Phone Validation

### Priority (Email/Phone): 🟠 **MEDIUM**

### Estimated Effort (Email/Phone): **2-3 days**

### Current Issues (Email/Phone)

- Email validation bypass
- Phone enumeration attacks
- No ownership verification

### Remediation Steps (Email/Phone)

#### 9.1 Email Validation

**File:** `server/lib/email.ts`, `client/utils/email.ts`

**Action Items:**

- [ ] Implement RFC 5322 email validation
- [ ] Check email against disposable email list
- [ ] Add SMTP verification (optional)
- [ ] Rate limit email sending
- [ ] Add email verification flow
- [ ] Prevent email enumeration in errors

#### 9.2 Phone Validation

**File:** `server/lib/phoneNumber.ts`

**Action Items:**

- [ ] Use `libphonenumber-js` for validation
- [ ] Verify phone number country codes
- [ ] Implement SMS verification
- [ ] Rate limit SMS sending (5 per hour)
- [ ] Add phone number change confirmation
- [ ] Prevent phone enumeration

#### 9.3 Verification System

**New File:** `server/lib/verification.ts`

**Action Items:**

- [ ] Create verification token system
- [ ] Add email verification on signup
- [ ] Add phone verification on signup
- [ ] Implement re-verification on changes
- [ ] Add verification expiry (24 hours)
- [ ] Store verification attempts in Redis

---

## 10. Logging & Information Disclosure

### Priority (Logging): 🟠 **MEDIUM**

### Estimated Effort: **2 days**

### Current Issues (Logging)

- Excessive request logging
- Stack traces in responses
- Sensitive data in logs

### Remediation Steps (Logging)

#### 10.1 Structured Logging

**File:** `lib/logger.ts`

**Action Items:**

- [ ] Implement Winston or Pino logger
- [ ] Use JSON structured logging
- [ ] Add log levels and filtering
- [ ] Remove console.log statements
- [ ] Add correlation IDs
- [ ] Implement log sampling

**Implementation:**

```typescript
import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
```

#### 10.2 Error Handling

**New File:** `server/graphql/errorHandler.ts`

**Action Items:**

- [ ] Create custom error classes
- [ ] Sanitize error messages for clients
- [ ] Log full errors server-side only
- [ ] Remove stack traces in production
- [ ] Add error codes instead of messages
- [ ] Implement error monitoring (Sentry)

#### 10.3 PII Protection

**File:** `middleware.ts`

**Action Items:**

- [ ] Remove IP logging in production
- [ ] Redact sensitive headers
- [ ] Hash user IDs in logs
- [ ] Add GDPR-compliant logging
- [ ] Implement log retention policies
- [ ] Create data anonymization pipeline

---

## 11. Dependency Management

### Priority (Dependency): 🟠 **MEDIUM**

### Estimated Effort: **Ongoing**

### Current Issues (Dependency)

- No automated vulnerability scanning
- Outdated packages
- Supply chain risks

### Remediation Steps (Dependency)

#### 11.1 Dependency Scanning

**New File:** `.github/workflows/security.yml`

**Action Items:**

- [ ] Add Snyk or Dependabot
- [ ] Run `npm audit` / `bun audit` in CI
- [ ] Set up automated PR for updates
- [ ] Add SonarQube scanning
- [ ] Implement license compliance checks
- [ ] Create security policy (SECURITY.md)

#### 11.2 Package Management

**File:** `package.json`

**Action Items:**

- [ ] Pin exact versions (remove ^, ~)
- [ ] Use lock file (package-lock.json)
- [ ] Audit new packages before adding
- [ ] Remove unused dependencies
- [ ] Use npm ci instead of npm install
- [ ] Verify package signatures

#### 11.3 Supply Chain Security

**Action Items:**

- [ ] Enable 2FA on npm account
- [ ] Use private npm registry
- [ ] Implement package whitelisting
- [ ] Monitor package changes
- [ ] Use Subresource Integrity (SRI)
- [ ] Regular security training for team

---

## 12. SSRF Prevention

### Priority (SSRF): 🟠 **MEDIUM**

### Estimated Effort (SSRF): **2 days**

### Current Issues (SSRF)

- Potential SSRF in URL fetching
- Email service exploitation
- Image processing from external URLs

### Remediation Steps (SSRF)

#### 12.1 URL Validation

**New File:** `server/lib/urlValidator.ts`

**Action Items:**

- [ ] Whitelist allowed domains
- [ ] Block private IP ranges (RFC 1918)
- [ ] Block localhost and 127.0.0.1
- [ ] Validate URL schemes (https only)
- [ ] Add DNS rebinding protection
- [ ] Implement request timeouts

**Implementation:**

```typescript
const BLOCKED_IP_RANGES = [
  "0.0.0.0/8",
  "10.0.0.0/8",
  "127.0.0.0/8",
  "169.254.0.0/16",
  "172.16.0.0/12",
  "192.168.0.0/16",
  "224.0.0.0/4",
];
```

#### 12.2 HTTP Client Configuration

**File:** Any fetch/axios usage

**Action Items:**

- [ ] Disable redirects or limit to 3
- [ ] Set connection timeout (5s)
- [ ] Set read timeout (10s)
- [ ] Validate response content types
- [ ] Limit response size
- [ ] Add user agent identification

#### 12.3 Image Processing Security

**File:** `server/storage/*.ts`

**Action Items:**

- [ ] Use image proxy service
- [ ] Validate image sources
- [ ] Process images in sandboxed environment
- [ ] Add image size limits
- [ ] Use CDN for external images
- [ ] Implement image caching

---

## 13. Business Logic Security

### Priority (Logic): 🟡 **HIGH**

### Estimated Effort (Logic): **Ongoing**

### Current Issues (Logic)

- Authorization bypass potential
- Race conditions
- Price/quantity manipulation

### Remediation Steps (Logic)

#### 13.1 Authorization Testing

**New File:** `server/graphql/tests/authorization.test.ts`

**Action Items:**

- [ ] Create authorization test suite
- [ ] Test all GraphQL resolvers
- [ ] Verify horizontal privilege escalation
- [ ] Test vertical privilege escalation
- [ ] Add negative test cases
- [ ] Implement authorization matrix

#### 13.2 Race Condition Prevention

**New File:** `server/lib/locks.ts`

**Action Items:**

- [ ] Implement distributed locks (Redis)
- [ ] Add optimistic locking in database
- [ ] Use database transactions
- [ ] Add idempotency keys for operations
- [ ] Implement retry logic with exponential backoff
- [ ] Test concurrent operations

**Implementation:**

```typescript
// Distributed lock with Redis
async function withLock(key: string, callback: () => Promise<void>) {
  const lockKey = `lock:${key}`;
  const lockValue = crypto.randomUUID();

  // Acquire lock
  const acquired = await redisService.set(lockKey, lockValue, {
    nx: true,
    ex: 10,
  });

  if (!acquired) {
    throw new Error("Could not acquire lock");
  }

  try {
    await callback();
  } finally {
    // Release lock
    await redisService.del(lockKey);
  }
}
```

#### 13.3 Input Sanitization

**File:** All resolvers in `server/graphql/mutation/*`, `server/graphql/query/*`

**Action Items:**

- [ ] Sanitize all user inputs
- [ ] Add business rule validation
- [ ] Implement data consistency checks
- [ ] Add audit logging for sensitive operations
- [ ] Create transaction rollback mechanisms
- [ ] Test edge cases and boundary conditions

#### 13.4 Template Injection Prevention

**File:** Template-related files in `server/graphql/mutation/template.ts`

**Action Items:**

- [ ] Sanitize template content
- [ ] Use safe templating engine
- [ ] Restrict template syntax
- [ ] Implement content sandboxing
- [ ] Add template review process
- [ ] Prevent code execution in templates

---

## Implementation Timeline

### Phase 1: Critical Security (Weeks 1-2)

#### Priority: 🔴 CRITICA

- [ ] Authentication & Session Management (Section 1)
- [ ] GraphQL API Security (Section 2)
- [ ] Rate Limiting Enhancement (Section 4)
- [ ] Database Security (Section 5)

### Phase 2: High Priority (Weeks 3-4)

#### Priority: 🟡 HIGH

- [ ] CORS & CSP Configuration (Section 3)
- [ ] File Upload/Storage Security (Section 6)
- [ ] Business Logic Security (Section 13)

### Phase 3: Medium Priority (Weeks 5-6)

#### Priority: 🟠 MEDIUM

- [ ] Redis Security (Section 7)
- [ ] Environment Variable Protection (Section 8)
- [ ] Email/Phone Validation (Section 9)
- [ ] Logging & Information Disclosure (Section 10)
- [ ] SSRF Prevention (Section 12)

### Phase 4: Ongoing Security

#### Priority: 🟠 MEDIUM (Continuous)

- [ ] Dependency Management (Section 11)
- [ ] Security Monitoring
- [ ] Penetration Testing
- [ ] Security Training

---

## Testing & Validation

### Security Testing Checklist

#### Authentication Testing

- [ ] Test JWT expiration and refresh
- [ ] Test session hijacking scenarios
- [ ] Test concurrent session limits
- [ ] Test MFA bypass attempts
- [ ] Test password reset vulnerabilities

#### API Security Testing

- [ ] Test GraphQL query depth attacks
- [ ] Test query complexity attacks
- [ ] Test introspection access
- [ ] Test batch operation limits
- [ ] Test field-level authorization

#### Input Validation Testing

- [ ] Test SQL injection attempts
- [ ] Test XSS payloads
- [ ] Test command injection
- [ ] Test path traversal
- [ ] Test SSRF attempts

#### Rate Limiting Testing

- [ ] Test rate limit enforcement
- [ ] Test rate limit bypass attempts
- [ ] Test distributed rate limiting
- [ ] Test fail-over behavior

### Automated Security Testing

**New File:** `.github/workflows/security-tests.yml`

```yaml
name: Security Tests
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run dependency audit
        run: bun audit
      - name: Run SAST scanning
        uses: github/codeql-action/analyze@v2
      - name: Run secret scanning
        uses: trufflesecurity/trufflehog@main
      - name: Run security tests
        run: bun test:security
```

---

## Monitoring & Alerting

### Security Monitoring Setup

#### 13.1 Log Aggregation

**Tools:** ELK Stack, Grafana Loki, or CloudWatch

**Action Items:**

- [ ] Set up centralized logging
- [ ] Create security dashboards
- [ ] Configure log retention (90 days)
- [ ] Add log search capabilities
- [ ] Implement log correlation

#### 13.2 Security Alerts

**Tools:** PagerDuty, Opsgenie, or AWS CloudWatch Alarms

**Alert Triggers:**

- [ ] Failed authentication attempts (>5 in 5min)
- [ ] Rate limit violations (>10 in 1min)
- [ ] CSRF token failures
- [ ] Unusual API usage patterns
- [ ] Database query errors
- [ ] File upload violations
- [ ] CSP violations (>10 per page)

#### 13.3 Metrics to Track

- Authentication success/failure rates
- API response times
- Rate limit hit rates
- Database query performance
- Redis cache hit rates
- File upload success rates
- Error rates by endpoint
- Active sessions count

---

## Documentation Requirements

### Security Documentation

#### For Developers

- [ ] Update AUTH_FLOW.md with new security measures
- [ ] Create SECURITY_BEST_PRACTICES.md
- [ ] Document secure coding guidelines
- [ ] Create API security documentation
- [ ] Add security review checklist

#### For Operations

- [ ] Create INCIDENT_RESPONSE.md
- [ ] Document security monitoring procedures
- [ ] Create runbook for security incidents
- [ ] Document backup and recovery procedures
- [ ] Add security audit procedures

#### For Users

- [ ] Create SECURITY.md for vulnerability reporting
- [ ] Document password requirements
- [ ] Explain MFA setup process
- [ ] Privacy policy updates
- [ ] Terms of service updates

---

## Compliance Considerations

### Regulatory Compliance

#### GDPR (If applicable)

- [ ] Data minimization
- [ ] Right to erasure implementation
- [ ] Data portability features
- [ ] Consent management
- [ ] Data breach notification system
- [ ] Privacy by design

#### OWASP Top 10 Compliance

- [ ] A01:2021 - Broken Access Control ✓
- [ ] A02:2021 - Cryptographic Failures ✓
- [ ] A03:2021 - Injection ✓
- [ ] A04:2021 - Insecure Design ✓
- [ ] A05:2021 - Security Misconfiguration ✓
- [ ] A06:2021 - Vulnerable Components ✓
- [ ] A07:2021 - Identification and Authentication Failures ✓
- [ ] A08:2021 - Software and Data Integrity Failures ✓
- [ ] A09:2021 - Security Logging and Monitoring Failures ✓
- [ ] A10:2021 - Server-Side Request Forgery ✓

---

## Success Metrics

### Key Performance Indicators (KPIs)

1. **Security Posture**
   - Zero critical vulnerabilities
   - <5 high-severity vulnerabilities
   - 100% of code with security review

2. **Authentication Security**
   - <0.1% failed authentication rate
   - 100% of sessions with proper security flags
   - Zero session hijacking incidents

3. **API Security**
   - Zero GraphQL query depth attacks
   - <1% rate limit violations
   - 100% of endpoints with authorization

4. **Incident Response**
   - <15 minutes incident detection time
   - <1 hour incident response time
   - Zero data breaches

---

## Risk Assessment

### Residual Risks After Implementation

1. **Low Risk**
   - Sophisticated APT attacks
   - Zero-day vulnerabilities in dependencies
   - Physical security breaches

2. **Medium Risk**
   - DDoS attacks (mitigate with CDN/WAF)
   - Social engineering attacks
   - Insider threats

3. **Mitigation Strategies**
   - Implement WAF (Cloudflare, AWS WAF)
   - Add DDoS protection
   - Employee security training
   - Regular penetration testing
   - Bug bounty program

---

## Budget & Resources

### Estimated Costs

1. **Development Time:** 6-8 weeks (1-2 developers)
2. **Tools & Services:**
   - Secrets Manager: $5-50/month
   - Security Monitoring: $50-200/month
   - CDN/WAF: $20-100/month
   - Penetration Testing: $5,000-15,000/year
3. **Training:** $500-2,000/developer

### Total Estimated Investment: $25,000-50,000/year

---

## Approval & Sign-off

| Role            | Name | Signature | Date |
| --------------- | ---- | --------- | ---- |
| Security Lead   |      |           |      |
| Tech Lead       |      |           |      |
| Product Manager |      |           |      |
| CTO             |      |           |      |

---

## Revision History

| Version | Date       | Author         | Changes                         |
| ------- | ---------- | -------------- | ------------------------------- |
| 1.0     | 2025-10-10 | Security Audit | Initial security hardening plan |

---

## References & Resources

### Security Standards

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

### GraphQL Security

- [GraphQL Security Best Practices](https://graphql.org/learn/best-practices/)
- [Apollo Server Security](https://www.apollographql.com/docs/apollo-server/security/)

### Next.js Security

- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [Vercel Security Best Practices](https://vercel.com/docs/security)

### Tools

- [Snyk](https://snyk.io/)
- [OWASP ZAP](https://www.zaproxy.org/)
- [Burp Suite](https://portswigger.net/burp)
- [SonarQube](https://www.sonarqube.org/)

---

**Last Updated:** October 10, 2025  
**Next Review:** November 10, 2025
