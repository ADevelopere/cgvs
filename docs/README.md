# Documentation Index

Welcome to the project documentation. This directory contains comprehensive documentation for architecture, security, implementation details, and operational procedures.

---

## 📚 Documentation Overview

### Architecture & Design

- **[REDIS_SERVICE_ARCHITECTURE.md](./REDIS_SERVICE_ARCHITECTURE.md)** - Redis service design and implementation
- **[REDIS_IMPLEMENTATION_COMPLETE.md](./REDIS_IMPLEMENTATION_COMPLETE.md)** - Redis implementation completion notes

### Security Documentation

- **[SECURITY_HARDENING_PLAN.md](./SECURITY_HARDENING_PLAN.md)** - Comprehensive security hardening roadmap
- **[SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md)** - Quick reference security checklist
- **[SECURITY_MIGRATION.md](./SECURITY_MIGRATION.md)** - Security migration guide
- **[AUTH_FLOW.md](./AUTH_FLOW.md)** - Authentication and authorization flow

---

## 🚀 Quick Start for New Developers

1. **Read the Architecture Docs** - Understand the system design
2. **Review Security Guidelines** - Familiarize yourself with security best practices
3. **Check Authentication Flow** - Learn how auth works in this application
4. **Review Checklist** - Use for implementing new features

---

## 🔒 Security

### Priority Reading

1. [AUTH_FLOW.md](./AUTH_FLOW.md) - How authentication works
2. [SECURITY_HARDENING_PLAN.md](./SECURITY_HARDENING_PLAN.md) - Security implementation plan
3. [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) - Daily security checklist

### Reporting Security Issues

If you discover a security vulnerability, please see the [Security Policy](../SECURITY.md) for reporting procedures.

**DO NOT** open public issues for security vulnerabilities.

---

## 📖 Documentation Categories

### 1. Architecture Documents

Documents describing system architecture, design decisions, and technical implementation details.

- Redis service architecture
- Database schema and relations
- GraphQL schema design
- Service layer organization

### 2. Security Documents

Security policies, procedures, hardening guides, and incident response plans.

- Security hardening plan
- Authentication flow
- Security checklist
- Migration guides

### 3. Operational Documents

Day-to-day operational procedures, deployment guides, and monitoring setup.

- Deployment procedures
- Monitoring and alerting
- Backup and recovery
- Incident response

### 4. Development Guides

Guidelines for developers contributing to the project.

- Coding standards
- Testing requirements
- Code review checklist
- Development workflow

---

## 🔧 Technical Stack

### Frontend

- **Framework:** Next.js 15 (App Router)
- **UI Library:** Material-UI (MUI)
- **State Management:** React Context + Apollo Client
- **Styling:** CSS Modules + Emotion
- **Internationalization:** Custom i18n system

### Backend

- **API:** GraphQL (Apollo Server)
- **Database:** PostgreSQL + Drizzle ORM
- **Cache/Session:** Redis
- **Authentication:** JWT (Access + Refresh tokens)
- **File Storage:** Disk-based + Cloud storage

### DevOps

- **Runtime:** Bun
- **Database Migrations:** Drizzle Kit
- **Code Generation:** GraphQL Code Generator
- **Linting:** ESLint + Prettier
- **Testing:** Jest (planned)

---

## 📝 Document Standards

### Writing Guidelines

1. Use clear, concise language
2. Include code examples where appropriate
3. Keep documents up-to-date
4. Add table of contents for long documents
5. Use proper markdown formatting

### Document Structure

```markdown
# Document Title

**Version:** X.X
**Date:** YYYY-MM-DD
**Author:** Name
**Status:** Draft | Review | Approved

## Overview
Brief description

## Table of Contents
- [Section 1](#section-1)
- [Section 2](#section-2)

## Content
...

## References
Links to related documents
```

### Maintenance

- Review documents quarterly
- Update version numbers on changes
- Archive outdated documents
- Link related documents

---

## 🤝 Contributing to Documentation

### Adding New Documents

1. Create document in appropriate category
2. Follow document standards above
3. Add entry to this index
4. Submit PR for review
5. Update relevant cross-references

### Updating Existing Documents

1. Update version number and date
2. Add entry to revision history
3. Notify team of significant changes
4. Update related documents if needed

---

## 📅 Document Review Schedule

| Document | Last Review | Next Review | Owner |
|----------|-------------|-------------|-------|
| Security Hardening Plan | 2025-10-10 | 2025-11-10 | Security Team |
| Auth Flow | TBD | TBD | Backend Team |
| Redis Architecture | TBD | TBD | Backend Team |

---

## 🔗 External Resources

### Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Apollo GraphQL Documentation](https://www.apollographql.com/docs/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Material-UI Documentation](https://mui.com/material-ui/)

### Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GraphQL Security Best Practices](https://graphql.org/learn/best-practices/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)

### Tools Documentation

- [Bun Documentation](https://bun.sh/docs)
- [Redis Documentation](https://redis.io/documentation)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## 📞 Support & Contact

For questions or clarifications about documentation:

- **Documentation Issues:** Open an issue on GitHub
- **Technical Questions:** Contact the development team
- **Security Concerns:** See [SECURITY.md](../SECURITY.md)

---

**Last Updated:** October 10, 2025  
**Maintained By:** Development Team
