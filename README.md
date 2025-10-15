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
---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI powered by [Material-UI](https://mui.com/)
- GraphQL API with [Apollo Server](https://www.apollographql.com/)
- Database ORM by [Drizzle](https://orm.drizzle.team/)
- Fast runtime by [Bun](https://bun.sh/)

---

## Troubleshooting Local Development

If you encounter issues while running scripts that interact with Google Cloud services from your local machine, here are solutions to common authentication errors.

---

### Error: `Could not load the default credentials`

This error occurs when the Google Cloud client libraries within the application cannot find authentication credentials, even if you have already logged in via the `gcloud` CLI.

* **Cause:** The initial `gcloud init` command authenticates **you** for using the command-line tool. However, the application code requires a separate credential file known as **Application Default Credentials (ADC)** to authenticate **itself**.
* **Solution:** Generate the ADC file by running the following command. This will open a browser for you to log in and grant permissions.

    ```bash
    gcloud auth application-default login
    ```

---

### Error: `invalid_grant: Invalid JWT`

After resolving the first issue, you might encounter an error related to an invalid JSON Web Token (JWT).

* **Cause:** This error almost always means your computer's system clock is out of sync with Google's servers. For security, authentication tokens are timestamped and have a very short lifespan. If your clock is off by even a few minutes, Google will reject the token as invalid.
* **Solution:** You must force your operating system to synchronize its clock with an internet time server.

    **On Windows:**
    1.  Go to **Settings** > **Time & Language** > **Date & time**.
    2.  Ensure **"Set time automatically"** is enabled.
    3.  Click the **"Sync now"** button to update your clock.

## Setting up a Redis-Compatible Service on Native Windows

For Windows development without Docker or WSL, this project uses **Memurai**, a native, Redis-compatible datastore. It installs as a proper Windows service and provides a modern alternative to the outdated MSOpenTech Redis port.

---

### 1. Installation

Install the free Memurai Developer Edition using the Windows Package Manager (`winget`). Open PowerShell or Command Prompt as an administrator and run:

```sh
winget install -e --id Memurai.MemuraiDeveloper