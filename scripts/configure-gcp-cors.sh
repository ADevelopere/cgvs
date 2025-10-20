#!/bin/bash

# configure-gcp-cors.sh - Google Cloud Storage Bucket CORS Configuration Script
# This script reads production domain and bucket name from .env file,
# prompts for missing values, and configures CORS for the bucket

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if gcloud is installed and authenticated
check_gcloud_setup() {
    if ! command -v gcloud &> /dev/null; then
        print_error "Google Cloud CLI (gcloud) is not installed"
        print_status "Please run: ./scripts/setup-gcloud.sh"
        exit 1
    fi

    # Check if user is authenticated
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "@"; then
        print_error "Not authenticated with Google Cloud"
        print_status "Please run: ./scripts/setup-gcloud.sh"
        exit 1
    fi

    print_success "Google Cloud CLI is installed and authenticated"
}

# Function to read environment variables from .env file
read_env_file() {
    local env_file=".env"

    if [ ! -f "$env_file" ]; then
        print_warning ".env file not found"
        return 1
    fi

    print_status "Reading environment variables from .env file..."

    # Source the .env file
    set -a  # automatically export all variables
    source "$env_file"
    set +a  # stop automatically exporting

    return 0
}

# Function to prompt for missing values
prompt_for_value() {
    local var_name="$1"
    local var_description="$2"
    local current_value="$3"

    if [ -n "$current_value" ]; then
        print_status "$var_description found: $current_value"
        echo "$current_value"
        return 0
    fi

    print_warning "$var_description not found in .env file"
    echo -n "Please enter $var_description: "
    read -r user_input

    if [ -z "$user_input" ]; then
        print_error "$var_description cannot be empty"
        exit 1
    fi

    echo "$user_input"
}

# Function to validate domain format
validate_domain() {
    local domain="$1"

    # Basic domain validation regex
    if [[ $domain =~ ^https?://[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*(:[0-9]{1,5})?/?$ ]]; then
        return 0
    else
        print_error "Invalid domain format: $domain"
        print_status "Domain should be in format: https://example.com or http://localhost:3000"
        return 1
    fi
}

# Function to validate bucket name
validate_bucket_name() {
    local bucket_name="$1"

    # GCS bucket name validation
    if [[ $bucket_name =~ ^[a-z0-9][a-z0-9\-_]*[a-z0-9]$ ]] && [ ${#bucket_name} -ge 3 ] && [ ${#bucket_name} -le 63 ]; then
        return 0
    else
        print_error "Invalid bucket name: $bucket_name"
        print_status "Bucket name must be 3-63 characters, lowercase letters, numbers, hyphens, and underscores only"
        return 1
    fi
}

# Function to check if bucket exists
check_bucket_exists() {
    local bucket_name="$1"

    print_status "Checking if bucket gs://$bucket_name exists..."

    if gsutil ls -b "gs://$bucket_name" &> /dev/null; then
        print_success "Bucket gs://$bucket_name exists"
        return 0
    else
        print_error "Bucket gs://$bucket_name does not exist or is not accessible"
        print_status "Please ensure the bucket exists and you have access to it"
        return 1
    fi
}

# Function to create CORS configuration
create_cors_config() {
    local production_domain="$1"
    local bucket_name="$2"
    local cors_file="cors-config.json"

    print_status "Creating CORS configuration..."

    # Create CORS configuration JSON
    cat > "$cors_file" << EOF
[
  {
    "maxAgeSeconds": 3600,
    "method": ["PUT", "GET", "OPTIONS"],
    "origin": [
      "http://localhost:3000",
      "http://localhost:3001",
      "$production_domain"
    ],
    "responseHeader": [
      "Content-Type",
      "Content-MD5",
      "x-goog-resumable",
      "Access-Control-Allow-Origin"
    ]
  }
]
EOF

    print_success "CORS configuration created: $cors_file"
}

# Function to apply CORS configuration
apply_cors_config() {
    local bucket_name="$1"
    local cors_file="cors-config.json"

    print_status "Applying CORS configuration to bucket gs://$bucket_name..."

    # Apply CORS configuration
    if gsutil cors set "$cors_file" "gs://$bucket_name"; then
        print_success "CORS configuration applied successfully"
    else
        print_error "Failed to apply CORS configuration"
        return 1
    fi

    # Verify the configuration
    print_status "Verifying CORS configuration..."
    gsutil cors get "gs://$bucket_name"
}

# Function to clean up temporary files
cleanup() {
    local cors_file="cors-config.json"

    if [ -f "$cors_file" ]; then
        print_status "Cleaning up temporary files..."
        rm -f "$cors_file"
        print_success "Cleanup completed"
    fi
}

# Function to show current CORS configuration
show_current_cors() {
    local bucket_name="$1"

    print_status "Current CORS configuration for gs://$bucket_name:"
    gsutil cors get "gs://$bucket_name" 2>/dev/null || print_warning "No CORS configuration found"
}

# Main execution
main() {
    print_status "Starting GCP Bucket CORS Configuration..."

    # Check gcloud setup
    check_gcloud_setup

    # Try to read .env file
    read_env_file || print_warning "Continuing without .env file..."

    # Get production domain
    PRODUCTION_DOMAIN=$(prompt_for_value "PRODUCTION_DOMAIN" "Production domain" "$PRODUCTION_DOMAIN")

    # Validate domain
    if ! validate_domain "$PRODUCTION_DOMAIN"; then
        exit 1
    fi

    # Get bucket name
    BUCKET_NAME=$(prompt_for_value "GCP_BUCKET_NAME" "GCP bucket name" "$GCP_BUCKET_NAME")

    # Validate bucket name
    if ! validate_bucket_name "$BUCKET_NAME"; then
        exit 1
    fi

    # Check if bucket exists
    if ! check_bucket_exists "$BUCKET_NAME"; then
        exit 1
    fi

    # Show current CORS configuration
    show_current_cors "$BUCKET_NAME"

    # Create CORS configuration
    create_cors_config "$PRODUCTION_DOMAIN" "$BUCKET_NAME"

    # Apply CORS configuration
    if apply_cors_config "$BUCKET_NAME"; then
        print_success "CORS configuration completed successfully!"
        print_status "Your bucket gs://$BUCKET_NAME is now configured for browser uploads from:"
        print_status "  - http://localhost:3000 (development)"
        print_status "  - http://localhost:3001 (alternative development port)"
        print_status "  - $PRODUCTION_DOMAIN (production)"
    else
        print_error "CORS configuration failed"
        exit 1
    fi

    # Clean up
    cleanup
}

# Trap to ensure cleanup on exit
trap cleanup EXIT

# Run main function
main "$@"
