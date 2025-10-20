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
- **Google Cloud Platform** account and project (for file storage)

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
# - GCP_PROJECT_ID, GCP_BUCKET_NAME, GCP_SECRET_ID (see GCP Setup section)
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

## ☁️ Google Cloud Platform (GCP) Setup

This application uses Google Cloud Storage for file storage and Secret Manager for secure credential management. Follow these steps to set up your GCP environment.

### Prerequisites

- Google Cloud Platform account
- Active GCP project
- Google Cloud CLI installed (see [Troubleshooting section](#troubleshooting-local-development))

### 1. Enable Required APIs

Enable the necessary Google Cloud APIs for your project:

```bash
# Set your project ID
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable storage.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable iam.googleapis.com
```

### 2. Create a Service Account

Create a service account with the necessary permissions for Cloud Storage operations:

```bash
# Create service account
gcloud iam service-accounts create cgsv-storage-service \
    --display-name="CGSV Storage Service Account" \
    --description="Service account for CGSV file storage operations"

# Get the service account email
SERVICE_ACCOUNT_EMAIL=$(gcloud iam service-accounts list \
    --filter="displayName:CGSV Storage Service Account" \
    --format="value(email)")

echo "Service Account Email: $SERVICE_ACCOUNT_EMAIL"
```

### 3. Assign Required IAM Roles

Assign the necessary roles to your service account:

```bash
# Assign Storage Object Admin role (includes signing permissions)
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/storage.objectAdmin"

# Assign Secret Manager Secret Accessor role
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/secretmanager.secretAccessor"
```

**Alternative Roles (if you prefer granular permissions):**

```bash
# For more granular control, you can use these roles instead:
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/storage.objectCreator"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/storage.objectViewer"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/secretmanager.secretAccessor"
```

### 4. Create and Download Service Account Key

Generate a service account key and download it:

```bash
# Create and download the service account key
gcloud iam service-accounts keys create ./service-account-key.json \
    --iam-account=$SERVICE_ACCOUNT_EMAIL

# Verify the key was created
ls -la ./service-account-key.json
```

### 5. Create Cloud Storage Bucket

Create a Cloud Storage bucket for file storage:

```bash
# Create bucket (replace with your preferred bucket name)
BUCKET_NAME="cgsv-storage-$(date +%s)"
gsutil mb gs://$BUCKET_NAME

# Set bucket permissions (optional - for public access to certain folders)
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME/public/

echo "Bucket created: $BUCKET_NAME"
```

### 6. Store Service Account Credentials in Secret Manager

Store the service account credentials securely in Secret Manager:

```bash
# Create secret in Secret Manager
SECRET_ID="cgsv-service-account-key"
gcloud secrets create $SECRET_ID \
    --data-file=./service-account-key.json \
    --replication-policy="automatic"

# Verify secret was created
gcloud secrets list --filter="name:$SECRET_ID"

# Clean up local key file for security
rm ./service-account-key.json
```

### 7. Configure Environment Variables

Add the following environment variables to your `.env` file:

```bash
# GCP Configuration
GCP_PROJECT_ID=your-project-id
GCP_BUCKET_NAME=your-bucket-name
GCP_SECRET_ID=cgsv-service-account-key
GCP_SECRET_VERSION=latest
```

### 8. Verify Setup

Test your GCP configuration:

```bash
# Test Secret Manager access
gcloud secrets versions access latest --secret=$SECRET_ID

# Test Storage bucket access
gsutil ls gs://$BUCKET_NAME

# Test service account permissions
gcloud auth activate-service-account --key-file=<(gcloud secrets versions access latest --secret=$SECRET_ID)
gsutil ls gs://$BUCKET_NAME
```

### Security Best Practices

1. **Never commit service account keys** to version control
2. **Use Secret Manager** for credential storage in production
3. **Rotate service account keys** regularly
4. **Follow principle of least privilege** when assigning roles
5. **Monitor service account usage** through Cloud Audit Logs

### Troubleshooting GCP Setup

**Common Issues:**

- **Permission Denied**: Ensure the service account has the correct IAM roles
- **Bucket Not Found**: Verify the bucket name and your project has access
- **Secret Access Denied**: Check Secret Manager permissions
- **Invalid Credentials**: Verify the service account key is valid and not expired
- **Browser Upload CORS Errors**: See [CORS Configuration](#cors-configuration-for-browser-uploads) section below

**Useful Commands:**

```bash
# Check current project
gcloud config get-value project

# List service accounts
gcloud iam service-accounts list

# Check IAM roles for service account
gcloud projects get-iam-policy YOUR_PROJECT_ID \
    --flatten="bindings[].members" \
    --filter="bindings.members:$SERVICE_ACCOUNT_EMAIL"

# Test authentication
gcloud auth list
```

---

## CORS Configuration for Browser Uploads

### Issue: Browser Upload Failures with CORS Errors

When uploading files from the browser to Google Cloud Storage using signed URLs, you may encounter CORS errors like:

```
XMLHttpRequest error with status 0
Network error or CORS issue - check browser console for details
```

### Root Cause

The issue occurs because:

1. **Browser CORS Policy**: Browsers enforce Cross-Origin Resource Sharing (CORS) policies for security
2. **Preflight Requests**: When using custom headers like `Content-MD5`, browsers send a preflight OPTIONS request
3. **Missing CORS Configuration**: The GCS bucket must be configured to allow these preflight requests

### Solution: Configure Bucket CORS

Your Google Cloud Storage bucket needs CORS configuration to allow browser uploads with the `Content-MD5` header.

#### 1. Check Current CORS Configuration

```bash
# Check if CORS is already configured
gsutil cors get gs://YOUR_BUCKET_NAME
```

#### 2. Create CORS Configuration File

Create a file named `cors-config.json` with the following content:

```json
[
  {
    "maxAgeSeconds": 3600,
    "method": ["PUT", "GET", "OPTIONS"],
    "origin": ["http://localhost:3000", "https://your-production-domain.com"],
    "responseHeader": [
      "Content-Type",
      "Content-MD5",
      "x-goog-resumable",
      "Access-Control-Allow-Origin"
    ]
  }
]
```

**Important Notes:**

- Replace `https://your-production-domain.com` with your actual production domain
- Add `http://localhost:3001` if you use a different development port
- The `Content-MD5` header is required for signed URL validation

#### 3. Apply CORS Configuration

```bash
# Apply the CORS configuration to your bucket
gsutil cors set cors-config.json gs://YOUR_BUCKET_NAME

# Verify the configuration was applied
gsutil cors get gs://YOUR_BUCKET_NAME
```

#### 4. Clean Up

```bash
# Remove the temporary configuration file
rm cors-config.json
```

### Verification

After applying the CORS configuration:

1. **Restart your development server** to ensure changes take effect
2. **Test file upload** in the browser - it should now work without CORS errors
3. **Check browser console** - there should be no CORS-related errors

### Why This Fix Works

- **Preflight Requests**: The `OPTIONS` method allows browsers to send preflight requests
- **Response Headers**: `Content-MD5` in `responseHeader` allows the browser to send this header
- **Origins**: Specified origins ensure only your domains can upload files
- **Caching**: `maxAgeSeconds` reduces the number of preflight requests

### Security Considerations

- **Restrict Origins**: Only include the domains that need upload access
- **Production Domains**: Always include your production domain in the CORS configuration
- **Development**: Include `localhost` origins for development environments

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

### Installing Google Cloud CLI on Linux

Before you can use Google Cloud services, you need to install the `gcloud` CLI tool.

**On Ubuntu/Debian:**

```bash
# Add the Cloud SDK distribution URI as a package source
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list

# Import the Google Cloud Platform public key
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -

# Update the package list and install the Cloud SDK
sudo apt-get update && sudo apt-get install google-cloud-cli
```

**On CentOS/RHEL/Fedora:**

```bash
# Add the Cloud SDK repository
sudo tee -a /etc/yum.repos.d/google-cloud-sdk.repo << EOM
[google-cloud-sdk]
name=Google Cloud SDK
baseurl=https://packages.cloud.google.com/yum/repos/cloud-sdk-el8-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg
       https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOM

# Install the Cloud SDK
sudo yum install google-cloud-cli
```

**On Arch Linux:**

```bash
# Install using pacman
sudo pacman -S google-cloud-cli
```

**Initialize gcloud:**

```bash
# After installation, initialize gcloud
gcloud init
```

**Automated Setup Script:**
For convenience, you can use the provided script that handles installation and authentication automatically:

```bash
# Run the setup script from the project root
./scripts/setup-gcloud.sh
```

This script will:

- Detect your operating system
- Check if gcloud is already installed
- Install gcloud if needed (supports Ubuntu/Debian, CentOS/RHEL/Fedora, Arch Linux, and macOS)
- Initialize gcloud configuration
- Set up authentication with Application Default Credentials

**After Authentication Setup:**
Once the script completes or after manual installation, you'll need to complete these additional steps:

1. **Set your Google Cloud project:**

```bash
# Replace with your actual project ID
gcloud config set project YOUR_PROJECT_ID
```

2. **Set the quota project for Application Default Credentials:**

```bash
# This ensures proper billing and quota management
gcloud auth application-default set-quota-project YOUR_PROJECT_ID
```

**Important Notes:**

- Replace `YOUR_PROJECT_ID` with your actual Google Cloud project ID
- The quota project setting is crucial for proper billing and quota management
- These commands will save credentials to `~/.config/gcloud/application_default_credentials.json`

---

### Error: `Could not load the default credentials`

This error occurs when the Google Cloud client libraries within the application cannot find authentication credentials, even if you have already logged in via the `gcloud` CLI.

- **Cause:** The initial `gcloud init` command authenticates **you** for using the command-line tool. However, the application code requires a separate credential file known as **Application Default Credentials (ADC)** to authenticate **itself**.
- **Solution:** Generate the ADC file by running the following command. This will open a browser for you to log in and grant permissions.

  ```bash
  gcloud auth application-default login
  ```

---

### Error: `invalid_grant: Invalid JWT`

After resolving the first issue, you might encounter an error related to an invalid JSON Web Token (JWT).

- **Cause:** This error almost always means your computer's system clock is out of sync with Google's servers. For security, authentication tokens are timestamped and have a very short lifespan. If your clock is off by even a few minutes, Google will reject the token as invalid.
- **Solution:** You must force your operating system to synchronize its clock with an internet time server.

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
```
