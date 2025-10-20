#!/bin/bash

# Get Signed URL Shell Script
#
# This script prompts for a file path and generates a signed URL for file upload.
# It uses terminal commands to calculate MD5 hash and calls the TypeScript script.
#
# Usage: ./get-signed-url.sh
#
# Prerequisites:
# - Node.js and Bun installed
# - GraphQL server running
# - md5sum command available

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
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

# Function to check if file exists
check_file_exists() {
    if [ ! -f "$1" ]; then
        print_error "File does not exist: $1"
        return 1
    fi
    return 0
}

# Function to get file extension and determine content type
get_content_type() {
    local file_path="$1"
    local extension="${file_path##*.}"

    case "$extension" in
        jpg|jpeg)
            echo "image/jpeg"
            ;;
        png)
            echo "image/png"
            ;;
        gif)
            echo "image/gif"
            ;;
        pdf)
            echo "application/pdf"
            ;;
        txt)
            echo "text/plain"
            ;;
        json)
            echo "application/json"
            ;;
        *)
            echo "application/octet-stream"
            ;;
    esac
}

# Function to generate MD5 hash using terminal
generate_md5() {
    local file_path="$1"

    if command -v md5sum >/dev/null 2>&1; then
        md5sum "$file_path" | cut -d' ' -f1
    elif command -v md5 >/dev/null 2>&1; then
        md5 -q "$file_path"
    else
        print_error "Neither md5sum nor md5 command found. Please install one of them."
        exit 1
    fi
}

# Function to get file size
get_file_size() {
    local file_path="$1"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        stat -f%z "$file_path"
    else
        # Linux
        stat -c%s "$file_path"
    fi
}

# Main function
main() {
    echo "=========================================="
    echo "    Signed URL Generator"
    echo "=========================================="
    echo

    # Prompt for file path
    read -p "Enter the file path: " file_path

    # Remove quotes if user added them
    file_path=$(echo "$file_path" | sed 's/^"//;s/"$//')

    # Check if file exists
    if ! check_file_exists "$file_path"; then
        exit 1
    fi

    # Get file information
    print_info "Analyzing file: $file_path"

    local file_size=$(get_file_size "$file_path")
    local content_type=$(get_content_type "$file_path")
    local md5_hash=$(generate_md5 "$file_path")
    local file_name=$(basename "$file_path")

    print_info "File details:"
    echo "  - Name: $file_name"
    echo "  - Size: $file_size bytes"
    echo "  - Content Type: $content_type"
    echo "  - MD5 Hash: $md5_hash"
    echo

    # Check if TypeScript script exists
    local script_path="./scripts/get-signed-url.ts"
    if [ ! -f "$script_path" ]; then
        print_error "TypeScript script not found: $script_path"
        exit 1
    fi

    # Run the TypeScript script
    print_info "Generating signed URL..."
    echo

    # Use Bun to run the TypeScript script
    if command -v bun >/dev/null 2>&1; then
        bun run "$script_path" "$file_path" "$content_type"
    elif command -v node >/dev/null 2>&1; then
        # If Bun is not available, try to compile and run with Node
        print_warning "Bun not found, trying with Node.js..."
        npx tsx "$script_path" "$file_path" "$content_type"
    else
        print_error "Neither Bun nor Node.js found. Please install one of them."
        exit 1
    fi

    local exit_code=$?

    if [ $exit_code -eq 0 ]; then
        print_success "Signed URL generated successfully!"
        echo
        print_info "You can now use this URL to upload your file via:"
        echo "  1. Postman (PUT request with binary body)"
        echo "  2. curl: curl -X PUT -H 'Content-Type: $content_type' --data-binary @\"$file_path\" <signed-url>"
        echo "  3. Any HTTP client"
    else
        print_error "Failed to generate signed URL"
        exit 1
    fi
}

# Check prerequisites
check_prerequisites() {
    local missing_deps=()

    # Check for md5sum or md5
    if ! command -v md5sum >/dev/null 2>&1 && ! command -v md5 >/dev/null 2>&1; then
        missing_deps+=("md5sum or md5")
    fi

    # Check for Bun or Node.js
    if ! command -v bun >/dev/null 2>&1 && ! command -v node >/dev/null 2>&1; then
        missing_deps+=("bun or node")
    fi

    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        print_info "Please install the missing dependencies and try again."
        exit 1
    fi
}

# Run the script
echo "Checking prerequisites..."
check_prerequisites
main
