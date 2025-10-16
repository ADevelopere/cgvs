#!/bin/bash

# setup-gcloud.sh - Google Cloud CLI Installation and Authentication Script
# This script checks if gcloud is installed, installs it if needed, and sets up authentication

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

# Function to detect the operating system
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/os-release ]; then
            . /etc/os-release
            OS=$ID
            OS_VERSION=$VERSION_ID
        else
            print_error "Cannot detect Linux distribution"
            exit 1
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
    else
        print_error "Unsupported operating system: $OSTYPE"
        exit 1
    fi
}

# Function to check if gcloud is installed
check_gcloud_installed() {
    if command -v gcloud &> /dev/null; then
        GCLOUD_VERSION=$(gcloud version --format="value(Google Cloud SDK)" 2>/dev/null || echo "unknown")
        print_success "Google Cloud CLI is already installed (version: $GCLOUD_VERSION)"
        return 0
    else
        print_warning "Google Cloud CLI is not installed"
        return 1
    fi
}

# Function to install gcloud on Ubuntu/Debian
install_gcloud_debian() {
    print_status "Installing Google Cloud CLI on Ubuntu/Debian..."
    
    # Add the Cloud SDK distribution URI as a package source
    echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
    
    # Import the Google Cloud Platform public key
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
    
    # Update the package list and install the Cloud SDK
    sudo apt-get update && sudo apt-get install -y google-cloud-cli
    
    print_success "Google Cloud CLI installed successfully"
}

# Function to install gcloud on CentOS/RHEL/Fedora
install_gcloud_rhel() {
    print_status "Installing Google Cloud CLI on CentOS/RHEL/Fedora..."
    
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
    sudo yum install -y google-cloud-cli
    
    print_success "Google Cloud CLI installed successfully"
}

# Function to install gcloud on Arch Linux
install_gcloud_arch() {
    print_status "Installing Google Cloud CLI on Arch Linux..."
    
    sudo pacman -S --noconfirm google-cloud-cli
    
    print_success "Google Cloud CLI installed successfully"
}

# Function to install gcloud on macOS
install_gcloud_macos() {
    print_status "Installing Google Cloud CLI on macOS..."
    
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        print_error "Homebrew is required to install Google Cloud CLI on macOS"
        print_status "Please install Homebrew first: https://brew.sh/"
        exit 1
    fi
    
    brew install --cask google-cloud-sdk
    
    print_success "Google Cloud CLI installed successfully"
}

# Function to install gcloud based on OS
install_gcloud() {
    case $OS in
        "ubuntu"|"debian")
            install_gcloud_debian
            ;;
        "centos"|"rhel"|"fedora")
            install_gcloud_rhel
            ;;
        "arch"|"manjaro")
            install_gcloud_arch
            ;;
        "macos")
            install_gcloud_macos
            ;;
        *)
            print_error "Unsupported distribution: $OS"
            print_status "Please install Google Cloud CLI manually: https://cloud.google.com/sdk/docs/install"
            exit 1
            ;;
    esac
}

# Function to set up gcloud authentication
setup_gcloud_auth() {
    print_status "Setting up Google Cloud authentication..."
    
    # Check if user is already authenticated
    if gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "@"; then
        print_success "Already authenticated with Google Cloud"
        ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
        print_status "Active account: $ACTIVE_ACCOUNT"
    else
        print_status "No active authentication found. Starting authentication process..."
        gcloud auth application-default login
        print_success "Authentication completed successfully"
    fi
    
    # Set up Application Default Credentials
    print_status "Setting up Application Default Credentials..."
    gcloud auth application-default login
    print_success "Application Default Credentials configured"
}

# Function to initialize gcloud if needed
initialize_gcloud() {
    if ! gcloud config list --format="value(core.account)" | grep -q "@"; then
        print_status "Initializing Google Cloud CLI..."
        gcloud init --console-only
        print_success "Google Cloud CLI initialized"
    else
        print_success "Google Cloud CLI is already initialized"
    fi
}

# Main execution
main() {
    print_status "Starting Google Cloud CLI setup..."
    
    # Detect operating system
    detect_os
    print_status "Detected OS: $OS"
    
    # Check if gcloud is installed
    if ! check_gcloud_installed; then
        print_status "Installing Google Cloud CLI..."
        install_gcloud
    fi
    
    # Initialize gcloud if needed
    initialize_gcloud
    
    # Set up authentication
    setup_gcloud_auth
    
    print_success "Google Cloud CLI setup completed successfully!"
    print_status "You can now use Google Cloud services in your application."
    
    # Show current configuration
    echo ""
    print_status "Current Google Cloud configuration:"
    gcloud config list
}

# Run main function
main "$@"
