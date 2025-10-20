#!/bin/bash

# Signed URL Upload Test Script
#
# This script tests the complete upload flow:
# 1. Uses get-signed-url.sh to generate a signed URL
# 2. Uses curl to upload the file to the signed URL
# 3. Validates the upload was successful
#
# Usage: ./test-signed-url-upload.sh
#
# Prerequisites:
# - GraphQL server running
# - get-signed-url.sh script available
# - demo1.jpg file in public/templateCover/
# - curl command available

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

# Test configuration
TEST_FILE="public/templateCover/demo1.jpg"
SCRIPT_PATH="./scripts/get-signed-url.sh"
TEMP_OUTPUT_FILE="/tmp/signed-url-output.txt"
EXPECTED_CONTENT_TYPE="image/jpeg"

# Function to check prerequisites
check_prerequisites() {
    local missing_deps=()

    # Check if test file exists
    if [ ! -f "$TEST_FILE" ]; then
        missing_deps+=("Test file: $TEST_FILE")
    fi

    # Check if script exists
    if [ ! -f "$SCRIPT_PATH" ]; then
        missing_deps+=("Script: $SCRIPT_PATH")
    fi

    # Check for curl
    if ! command -v curl >/dev/null 2>&1; then
        missing_deps+=("curl")
    fi

    # Check for md5sum or md5
    if ! command -v md5sum >/dev/null 2>&1 && ! command -v md5 >/dev/null 2>&1; then
        missing_deps+=("md5sum or md5")
    fi

    # Check for Bun or Node.js
    if ! command -v bun >/dev/null 2>&1 && ! command -v node >/dev/null 2>&1; then
        missing_deps+=("bun or node")
    fi

    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        print_info "Please install the missing dependencies and try again."
        exit 1
    fi
}

# Function to extract signed URL from script output
extract_signed_url() {
    local output_file="$1"

    # Look for the signed URL in the output
    # The URL should be between the separator lines
    local signed_url=""

    # Try to find URL pattern (starts with https://) - handle log prefixes
    signed_url=$(grep -E "https://" "$output_file" | sed 's/.*https:/https:/' | head -1)

    if [ -z "$signed_url" ]; then
        # Try alternative patterns - extract URL from log lines
        signed_url=$(grep -E "https://.*storage\.googleapis\.com" "$output_file" | sed 's/.*https:/https:/' | head -1)
    fi

    if [ -z "$signed_url" ]; then
        # Try to find any URL-like string and clean it
        signed_url=$(grep -E "https?://[^[:space:]]+" "$output_file" | sed 's/.*https:/https:/' | head -1)
    fi

    echo "$signed_url"
}

# Function to extract MD5 hash from script output
extract_md5_hash() {
    local output_file="$1"

    # Look for MD5 hash in base64 format
    local md5_hash=""

    # Try to find base64 MD5 pattern - handle log prefixes
    md5_hash=$(grep -E "MD5 \(base64\):" "$output_file" | sed 's/.*MD5 (base64): *//' | tr -d ' ')

    if [ -z "$md5_hash" ]; then
        # Try alternative patterns - extract from log lines
        md5_hash=$(grep -E "Content-MD5:" "$output_file" | sed 's/.*Content-MD5: *//' | tr -d ' ')
    fi

    echo "$md5_hash"
}

# Function to test upload with curl
test_upload() {
    local signed_url="$1"
    local md5_hash="$2"

    print_info "Testing upload with curl..."
    print_info "Signed URL: ${signed_url:0:100}..."
    print_info "MD5 Hash: $md5_hash"

    # Prepare curl command
    local curl_cmd="curl -X PUT"
    curl_cmd="$curl_cmd -H 'Content-Type: $EXPECTED_CONTENT_TYPE'"

    if [ -n "$md5_hash" ]; then
        curl_cmd="$curl_cmd -H 'Content-MD5: $md5_hash'"
    fi

    curl_cmd="$curl_cmd --data-binary @$TEST_FILE"
    curl_cmd="$curl_cmd -v"
    curl_cmd="$curl_cmd -w 'HTTP_CODE:%{http_code}'"
    curl_cmd="$curl_cmd '$signed_url'"

    print_info "Executing: $curl_cmd"

    # Execute curl command and capture output
    local curl_output
    local curl_exit_code

    if curl_output=$(eval "$curl_cmd" 2>&1); then
        curl_exit_code=0
    else
        curl_exit_code=$?
    fi

    # Extract HTTP status code
    local http_code
    http_code=$(echo "$curl_output" | grep "HTTP_CODE:" | sed 's/.*HTTP_CODE://')

    print_info "Curl exit code: $curl_exit_code"
    print_info "HTTP status code: $http_code"

    # Check if upload was successful
    if [ "$curl_exit_code" -eq 0 ] && [ "$http_code" -eq 200 ]; then
        print_success "Upload completed successfully!"
        return 0
    else
        print_error "Upload failed!"
        print_error "Curl output:"
        echo "$curl_output"
        return 1
    fi
}

# Function to run the main test
run_test() {
    print_info "Starting signed URL upload test..."
    echo "=========================================="

    # Step 1: Generate signed URL using the shell script
    print_info "Step 1: Generating signed URL..."

    # Create a temporary file to capture the script output
    echo "$TEST_FILE" | "$SCRIPT_PATH" > "$TEMP_OUTPUT_FILE" 2>&1

    local script_exit_code=$?

    if [ $script_exit_code -ne 0 ]; then
        print_error "Failed to generate signed URL"
        print_error "Script output:"
        cat "$TEMP_OUTPUT_FILE"
        return 1
    fi

    print_success "Signed URL generated successfully"

    # Step 2: Extract signed URL and MD5 hash from output
    print_info "Step 2: Extracting signed URL and MD5 hash..."

    local signed_url
    signed_url=$(extract_signed_url "$TEMP_OUTPUT_FILE")

    if [ -z "$signed_url" ]; then
        print_error "Could not extract signed URL from script output"
        print_error "Script output:"
        cat "$TEMP_OUTPUT_FILE"
        return 1
    fi

    local md5_hash
    md5_hash=$(extract_md5_hash "$TEMP_OUTPUT_FILE")

    if [ -z "$md5_hash" ]; then
        print_warning "Could not extract MD5 hash from script output"
        print_info "Proceeding without MD5 hash..."
    fi

    print_success "Extracted signed URL and MD5 hash"

    # Step 3: Test upload with curl
    print_info "Step 3: Testing upload with curl..."

    if test_upload "$signed_url" "$md5_hash"; then
        print_success "Upload test completed successfully!"
        return 0
    else
        print_error "Upload test failed!"
        return 1
    fi
}

# Function to cleanup
cleanup() {
    if [ -f "$TEMP_OUTPUT_FILE" ]; then
        rm -f "$TEMP_OUTPUT_FILE"
    fi
}

# Main function
main() {
    echo "=========================================="
    echo "    Signed URL Upload Test"
    echo "=========================================="
    echo

    # Set up cleanup trap
    trap cleanup EXIT

    # Check prerequisites
    print_info "Checking prerequisites..."
    check_prerequisites
    print_success "All prerequisites met"
    echo

    # Run the test
    if run_test; then
        echo
        print_success "=========================================="
        print_success "    ALL TESTS PASSED!"
        print_success "=========================================="
        exit 0
    else
        echo
        print_error "=========================================="
        print_error "    TESTS FAILED!"
        print_error "=========================================="
        exit 1
    fi
}

# Run the script
main "$@"
