# CGSV - Certificate Generation and Storage System

A modern, full-stack certificate generation and management system built with Next.js, GraphQL, and PostgreSQL.

---

## 📋 Overview

CGSV is a comprehensive platform for generating, managing, and distributing certificates and documents. It features a powerful template system, student/recipient management, and secure storage capabilities.

### Key Features

- 🎨 **Template Management** - Create and manage certificate templates
- 👥 **Student/Recipient Management** - Organize and track recipients
- 📁 **File Storage** - Secure storage and retrieval system
- 🔐 **Authentication & Authorization** - JWT-based secure access
- 🌍 **Internationalization** - Multi-language support (Arabic/English)
- 📊 **Dashboard Analytics** - Real-time statistics and insights
- 🎯 **GraphQL API** - Modern, type-safe API
- ⚡ **Fast & Modern** - Built with Next.js 15 and Bun

---

## 🚀 Quick Start

### Prerequisites

- **Bun** >= 1.0.0
- **Node.js** >= 18.17.0
- **PostgreSQL** >= 14
- **Redis** >= 6.0

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cgsvNew

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env

# Configure your .env file with:
# - DATABASE_URL
# - JWT_SECRET
# - REDIS_URL or UPSTASH credentials
# - Other required variables

# Run database migrations
bun run db:migrate

# Start Redis (if using local Redis)
cd containers/redis
docker-compose up -d

# Start development server
bun run dev
```

Visit `http://localhost:3000` to see the application.

---

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

### Getting Started
- [Documentation Index](./docs/README.md) - Overview of all documentation

### Architecture
- [Redis Service Architecture](./docs/REDIS_SERVICE_ARCHITECTURE.md)
- [Authentication Flow](./docs/AUTH_FLOW.md)

### Security
- [Security Hardening Plan](./docs/SECURITY_HARDENING_PLAN.md) - Comprehensive security roadmap
- [Security Checklist](./docs/SECURITY_CHECKLIST.md) - Implementation tracking
- [Security Policy](./SECURITY.md) - Vulnerability reporting

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI Library:** Material-UI (MUI) v6
- **State Management:** React Context + Apollo Client
- **Styling:** CSS Modules + Emotion
- **Language:** TypeScript

### Backend
- **API:** GraphQL (Apollo Server)
- **Schema Builder:** Pothos GraphQL
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Cache/Session:** Redis (Local or Upstash)
- **Authentication:** JWT

### DevOps & Tools
- **Runtime:** Bun
- **Code Generation:** GraphQL Code Generator
- **Linting:** ESLint
- **Type Checking:** TypeScript strict mode

---

## 📁 Project Structure

```
cgsvNew/
├── app/                    # Next.js App Router
│   ├── (root)/            # Protected routes
│   ├── api/               # API routes (GraphQL)
│   └── login/             # Authentication pages
├── client/                # Client-side code
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── graphql/           # GraphQL queries/mutations
│   ├── hooks/             # Custom React hooks
│   ├── locale/            # Internationalization
│   ├── theme/             # MUI theme configuration
│   ├── utils/             # Utility functions
│   └── views/             # Page views/containers
├── server/                # Server-side code
│   ├── db/                # Database schema & queries
│   ├── graphql/           # GraphQL resolvers & schema
│   ├── lib/               # Server utilities
│   ├── services/          # Business logic services
│   └── storage/           # File storage system
├── docs/                  # Documentation
├── containers/            # Docker configurations
└── public/                # Static assets
```

---

## 🔧 Available Scripts

### Development
```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run type-check   # Run TypeScript check
```

### Database
```bash
bun run db:generate  # Generate migrations
bun run db:migrate   # Run migrations
bun run db:push      # Push schema changes
bun run db:studio    # Open Drizzle Studio
bun run db:seed      # Seed database
```

### GraphQL
```bash
bun run gql:generate # Generate GraphQL schema
bun run codegen      # Generate TypeScript types
```

---

## 🔒 Security

Security is a top priority. We implement:

- ✅ JWT-based authentication with refresh tokens
- ✅ Rate limiting on all API endpoints
- ✅ Input validation and sanitization
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Secure headers (CSP, HSTS, etc.)
- ✅ Environment variable validation
- 🚧 Additional security measures (see [Security Plan](./docs/SECURITY_HARDENING_PLAN.md))

**Found a security issue?** See our [Security Policy](./SECURITY.md) for responsible disclosure.

---

## 🌍 Internationalization

The application supports multiple languages:

- 🇬🇧 English
- 🇸🇦 Arabic (RTL support)

Language files are located in `client/locale/`.

---

## 🧪 Testing

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test:watch

# Run tests with coverage
bun test:coverage
```

---

## 📦 Deployment

### Environment Variables

Ensure all required environment variables are set:

```env
# Application
NODE_ENV=production
ALLOWED_ORIGIN=https://yourdomain.com

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Authentication
JWT_SECRET=your-super-secret-key-min-32-chars

# Redis
REDIS_PROVIDER=upstash  # or 'local'
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Storage
STORAGE_TYPE=disk  # or 'cloud'
```

### Build & Deploy

```bash
# Build the application
bun run build

# Run migrations
bun run db:migrate

# Start production server
bun run start
```

### Deployment Platforms

This application can be deployed to:
- ✅ Vercel
- ✅ AWS
- ✅ DigitalOcean
- ✅ Self-hosted (Docker)

See platform-specific guides in `docs/deployment/` (coming soon).

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Follow security best practices
- Check the [Security Checklist](./docs/SECURITY_CHECKLIST.md)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI powered by [Material-UI](https://mui.com/)
- GraphQL API with [Apollo Server](https://www.apollographql.com/)
- Database ORM by [Drizzle](https://orm.drizzle.team/)
- Fast runtime by [Bun](https://bun.sh/)

---

## 📞 Support

- 📧 **Email:** support@yourdomain.com
- 🐛 **Issues:** [GitHub Issues](https://github.com/yourusername/cgsvNew/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/yourusername/cgsvNew/discussions)
- 📖 **Documentation:** [docs/](./docs/)

---

## 🗺️ Roadmap

- [x] Authentication & Authorization
- [x] GraphQL API
- [x] Template Management
- [x] Student Management
- [x] File Storage
- [x] Internationalization
- [ ] Certificate Generation
- [ ] Email Notifications
- [ ] Advanced Analytics
- [ ] Mobile App
- [ ] API Documentation (Swagger)
- [ ] Comprehensive Test Suite

See [SECURITY_HARDENING_PLAN.md](./docs/SECURITY_HARDENING_PLAN.md) for security roadmap.

---

## 📊 Project Status

- **Version:** 1.0.0 (Development)
- **Status:** Active Development
- **Last Updated:** October 10, 2025

---

**Made with ❤️ by the CGSV Team**

