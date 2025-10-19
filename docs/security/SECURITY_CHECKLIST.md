# Security Hardening Checklist

Quick reference checklist for implementing security measures. See [SECURITY_HARDENING_PLAN.md](./SECURITY_HARDENING_PLAN.md) for detailed implementation instructions.

---

## 🔴 Critical Priority (Weeks 1-2)

### Authentication & Session Management

- [ ] Generate and use strong JWT secrets (64+ chars)
- [ ] Set secure cookie flags (httpOnly, secure, sameSite)
- [ ] Implement token rotation on refresh
- [ ] Add token blacklist in Redis
- [ ] Implement session rotation on login
- [ ] Add concurrent session limits
- [ ] Configure access token expiry (15 min)
- [ ] Configure refresh token expiry (7 days)

### GraphQL API Security

- [ ] Install and configure `graphql-depth-limit`
- [ ] Install and configure `graphql-query-complexity`
- [ ] Disable introspection in production
- [ ] Limit query batch size to 5
- [ ] Audit all resolvers for authorization
- [ ] Implement field-level auth directives
- [ ] Add input validation middleware
- [ ] Sanitize all string inputs

### Rate Limiting

- [ ] Implement fail-closed for auth endpoints
- [ ] Add in-memory fallback rate limiter
- [ ] Reduce GraphQL rate limit to 50 req/min
- [ ] Add hybrid rate limiting (IP + User ID)
- [ ] Implement progressive delays
- [ ] Add CAPTCHA after multiple failures

### Database Security

- [ ] Audit all queries for SQL injection risks
- [ ] Add Zod schemas for all inputs
- [ ] Implement Row-Level Security (RLS)
- [ ] Enable SSL for database connections
- [ ] Add connection pooling limits
- [ ] Implement userId checks in all queries

---

## 🟡 High Priority (Weeks 3-4)

### CORS & CSP

- [ ] Remove `unsafe-eval` from CSP
- [ ] Remove `unsafe-inline` from CSP
- [ ] Implement nonce-based CSP
- [ ] Remove localhost from production CSP
- [ ] Add CSP report endpoint
- [ ] Use environment variable for CORS origins
- [ ] Remove hardcoded origin fallbacks

### File Upload Security

- [ ] Implement file type whitelist
- [ ] Add file size limits (10MB)
- [ ] Validate magic bytes
- [ ] Sanitize all filenames
- [ ] Use UUIDs for storage names
- [ ] Add SVG sanitization
- [ ] Require auth for file access
- [ ] Implement signed URLs

### Business Logic

- [ ] Create authorization test suite
- [ ] Test all GraphQL resolvers
- [ ] Implement distributed locks
- [ ] Add optimistic locking
- [ ] Add idempotency keys
- [ ] Sanitize template content

---

## 🟠 Medium Priority (Weeks 5-6)

### Redis Security

- [ ] Enable Redis AUTH
- [ ] Set strong Redis password
- [ ] Configure Redis ACL
- [ ] Disable dangerous commands
- [ ] Enable TLS for connections
- [ ] Encrypt sensitive session data
- [ ] Add Redis health checks

### Environment Variables

- [ ] Use secrets manager (AWS/Vault)
- [ ] Remove secrets from logs
- [ ] Implement log sanitization
- [ ] Audit NEXT*PUBLIC* variables
- [ ] Add secret scanning to CI/CD
- [ ] Add pre-commit hooks

### Email/Phone Validation

- [ ] Implement RFC 5322 email validation
- [ ] Add email verification flow
- [ ] Use `libphonenumber-js` for phones
- [ ] Implement SMS verification
- [ ] Rate limit email/SMS sending
- [ ] Prevent enumeration attacks

### Logging & Monitoring

- [ ] Implement Winston/Pino logger
- [ ] Use JSON structured logging
- [ ] Remove console.log statements
- [ ] Sanitize error messages for clients
- [ ] Remove stack traces in production
- [ ] Add error monitoring (Sentry)
- [ ] Redact PII from logs

### SSRF Prevention

- [ ] Whitelist allowed domains
- [ ] Block private IP ranges
- [ ] Validate URL schemes (HTTPS only)
- [ ] Add DNS rebinding protection
- [ ] Set connection/read timeouts
- [ ] Limit response sizes

---

## 🔄 Ongoing

### Dependency Management

- [ ] Add Snyk or Dependabot
- [ ] Run security audit in CI
- [ ] Pin exact package versions
- [ ] Remove unused dependencies
- [ ] Enable 2FA on npm account
- [ ] Regular dependency updates

### Testing

- [ ] Add authentication tests
- [ ] Add GraphQL security tests
- [ ] Add input validation tests
- [ ] Add rate limiting tests
- [ ] Run SAST scanning
- [ ] Run secret scanning

### Monitoring

- [ ] Set up centralized logging
- [ ] Create security dashboards
- [ ] Configure security alerts
- [ ] Monitor failed auth attempts
- [ ] Monitor rate limit violations
- [ ] Track API response times

### Documentation

- [ ] Update AUTH_FLOW.md
- [ ] Create SECURITY.md
- [ ] Document secure coding guidelines
- [ ] Create incident response plan
- [ ] Add security review checklist
- [ ] Update privacy policy

---

## Quick Wins (Can be done immediately)

- [ ] Add security headers to `next.config.ts`
- [ ] Enable `reactStrictMode` in Next.js config
- [ ] Add `.editorconfig` for consistent code style
- [ ] Create `.nvmrc` for Node version control
- [ ] Add pre-commit hooks with Husky
- [ ] Enable `strict` mode in `tsconfig.json`
- [ ] Add ESLint security plugins
- [ ] Configure Prettier for code formatting
- [ ] Add `.npmrc` with security settings
- [ ] Create `SECURITY.md` for vulnerability reporting

---

## Verification Checklist

After implementation, verify:

- [ ] All environment variables properly configured
- [ ] No secrets in code or logs
- [ ] All cookies have security flags
- [ ] GraphQL introspection disabled in production
- [ ] Rate limiting working on all endpoints
- [ ] Database queries use parameterization
- [ ] File uploads properly validated
- [ ] CSP headers configured correctly
- [ ] Security monitoring active
- [ ] Incident response plan documented

---

## Testing Commands

```bash
# Run security audit
bun audit

# Run tests
bun test

# Run linting
bun lint

# Check for secrets
trufflehog filesystem .

# Test rate limiting
ab -n 1000 -c 10 http://localhost:3000/api/graphql

# Scan for vulnerabilities
npm audit --audit-level=moderate
```

---

## Emergency Response

If a security incident occurs:

1. **Immediate Actions**
   - [ ] Identify and isolate affected systems
   - [ ] Revoke compromised credentials
   - [ ] Enable maintenance mode if necessary
   - [ ] Notify security team

2. **Investigation**
   - [ ] Review logs for attack vectors
   - [ ] Identify data accessed/modified
   - [ ] Document timeline of events
   - [ ] Preserve evidence

3. **Recovery**
   - [ ] Apply security patches
   - [ ] Rotate all secrets and credentials
   - [ ] Restore from clean backups if needed
   - [ ] Verify system integrity

4. **Post-Incident**
   - [ ] Notify affected users (if required)
   - [ ] Update security measures
   - [ ] Document lessons learned
   - [ ] Update incident response plan

---

## Contacts

**Security Team:**

- Security Lead: [email]
- On-Call Engineer: [phone]
- Incident Response: [email]

**External Resources:**

- Hosting Provider Support: [link]
- Security Consultant: [contact]
- Legal Team: [email]

---

**Status Tracking:**

- Total Items: ~150
- Completed: 0
- In Progress: 0
- Pending: 150

**Last Updated:** October 10, 2025
