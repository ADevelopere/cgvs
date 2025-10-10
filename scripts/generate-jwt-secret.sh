#!/bin/bash
###############################################################################
# JWT Secret Key Generator Script (Interactive)
#
# This script generates a secure random JWT secret key and provides
# interactive options to manage it in your .env file.
#
# Usage:
#   ./scripts/generate-jwt-secret.sh [length]
#
# Arguments:
#   length - Length of the secret key in bytes (optional, will prompt if not provided)
#
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Environment file paths
ENV_FILE="$PROJECT_ROOT/.env"
ENV_EXAMPLE_FILE="$PROJECT_ROOT/.env.example"

# Default and minimum lengths
DEFAULT_LENGTH=64
MIN_LENGTH=32

# Global variable for the generated secret
GENERATED_SECRET=""

# Function to generate a secret key
generate_secret() {
    local length=$1
    local secret=""

    # Generate random secret using openssl (most reliable on Linux)
    if command -v openssl &> /dev/null; then
        secret=$(openssl rand -hex "$length")
    elif [[ -f /dev/urandom ]]; then
        # Fallback to /dev/urandom with xxd
        secret=$(head -c "$length" /dev/urandom | xxd -p -c "$length")
    else
        echo -e "${RED}Error: Neither openssl nor /dev/urandom available${NC}"
        echo "Please install openssl: sudo apt-get install openssl"
        exit 1
    fi

    echo "$secret"
}

# Function to display the generated secret
display_secret() {
    local secret=$1
    local length=$2

    clear
    echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}${BOLD}           JWT Secret Key Generator${NC}"
    echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${CYAN}Generated JWT Secret Key (${length} bytes):${NC}"
    echo -e "${YELLOW}${secret}${NC}"
    echo ""
    echo -e "${BLUE}Security: ${length} bytes = $(( length * 2 )) hex characters${NC}"
    echo ""
}

# Function to copy to clipboard
copy_to_clipboard() {
    local secret=$1
    local copied=false

    # Try different clipboard commands
    if command -v xclip &> /dev/null; then
        echo -n "$secret" | xclip -selection clipboard 2>/dev/null && copied=true
    elif command -v xsel &> /dev/null; then
        echo -n "$secret" | xsel --clipboard 2>/dev/null && copied=true
    elif command -v wl-copy &> /dev/null; then
        echo -n "$secret" | wl-copy 2>/dev/null && copied=true
    elif command -v pbcopy &> /dev/null; then
        echo -n "$secret" | pbcopy 2>/dev/null && copied=true
    fi

    if [ "$copied" = true ]; then
        echo -e "${GREEN}✓ Secret key copied to clipboard!${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠ Clipboard not available${NC}"
        echo -e "${YELLOW}Install xclip: sudo apt-get install xclip${NC}"
        echo -e "${YELLOW}Or you're in a remote/codespace environment${NC}"
        echo ""
        echo -e "${CYAN}Copy manually:${NC}"
        echo -e "${YELLOW}${secret}${NC}"
        return 1
    fi
}

# Function to add or replace secret in .env file
update_env_file() {
    local secret=$1

    # Check if .env exists, if not create from .env.example
    if [[ ! -f "$ENV_FILE" ]]; then
        if [[ -f "$ENV_EXAMPLE_FILE" ]]; then
            echo -e "${YELLOW}Creating .env from .env.example...${NC}"
            cp "$ENV_EXAMPLE_FILE" "$ENV_FILE"
            echo -e "${GREEN}✓ Created .env file${NC}"
        else
            echo -e "${YELLOW}Creating new .env file...${NC}"
            touch "$ENV_FILE"
            echo -e "${GREEN}✓ Created .env file${NC}"
        fi
        echo ""
    fi

    # Check if JWT_SECRET already exists in .env
    if grep -q "^JWT_SECRET=" "$ENV_FILE" 2>/dev/null; then
        echo -e "${YELLOW}JWT_SECRET already exists in .env${NC}"
        echo -e "${CYAN}Current value will be replaced${NC}"
        echo ""

        # Replace the existing JWT_SECRET
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|^JWT_SECRET=.*|JWT_SECRET=${secret}|" "$ENV_FILE"
        else
            # Linux
            sed -i "s|^JWT_SECRET=.*|JWT_SECRET=${secret}|" "$ENV_FILE"
        fi
        echo -e "${GREEN}✓ JWT_SECRET updated in .env${NC}"
    else
        # Append JWT_SECRET to .env
        {
            echo ""
            echo "# JWT Secret Key - Generated $(date '+%Y-%m-%d %H:%M:%S')"
            echo "JWT_SECRET=${secret}"
        } >> "$ENV_FILE"
        echo -e "${GREEN}✓ JWT_SECRET added to .env${NC}"
    fi

    echo ""
    echo -e "${BLUE}Location: ${ENV_FILE}${NC}"
}

# Function to ask for length
ask_for_length() {
    local default_len=$1
    local input_len

    echo "" >&2
    echo -e "${CYAN}Enter secret key length in bytes (default: ${default_len}):${NC}" >&2
    echo -e "${YELLOW}Press Enter for default, or type a number${NC}" >&2
    echo -e "${BLUE}Recommended: 32 (min) to 128 (max security)${NC}" >&2
    echo -n "> " >&2
    read -r input_len

    # Use default if empty
    if [[ -z "$input_len" ]]; then
        input_len=$default_len
    fi

    # Validate input
    if ! [[ "$input_len" =~ ^[0-9]+$ ]]; then
        echo -e "${RED}Invalid input. Using default: ${default_len}${NC}" >&2
        input_len=$default_len
    fi

    # Enforce minimum
    if [[ "$input_len" -lt "$MIN_LENGTH" ]]; then
        echo -e "${YELLOW}Length too short. Using minimum: ${MIN_LENGTH}${NC}" >&2
        input_len=$MIN_LENGTH
    fi

    echo "$input_len"
}

# Function to show interactive menu
show_menu() {
    local secret=$1

    # Check if fzf is available
    if ! command -v fzf &> /dev/null; then
        echo -e "${YELLOW}fzf is not installed. Install it for better navigation:${NC}"
        echo "  sudo apt install fzf   # or: brew install fzf"
        echo ""
        echo "Falling back to basic menu..."
        show_menu_fallback "$secret"
        return
    fi

    echo -e "${BOLD}What would you like to do?${NC}"
    echo -e "${CYAN}Use arrow keys to navigate, Enter to select${NC}"
    echo ""

    local options=(
        "Add/Replace secret in .env file"
        "Regenerate a new secret key"
        "Copy secret to clipboard"
        "Exit"
    )

    local selected
    selected=$(printf "%s\n" "${options[@]}" | fzf \
        --prompt="Select action: " \
        --height=8 \
        --border \
        --reverse \
        --bind=ctrl-c:abort \
        --color=prompt:cyan,pointer:green)

    if [[ -z "$selected" ]]; then
        echo ""
        echo -e "${YELLOW}No action selected. Exiting.${NC}"
        exit 0
    fi

    case "$selected" in
        "Add/Replace secret in .env file")
            echo ""
            update_env_file "$secret"
            echo ""
            read -rp "$(echo -e "${CYAN}Press Enter to continue...${NC}")"
            display_secret "$secret" "$((${#secret} / 2))"
            show_menu "$secret"
            ;;
        "Regenerate a new secret key")
            echo ""
            new_length=$(ask_for_length "$DEFAULT_LENGTH")
            echo -e "${GREEN}Generating new secret with ${new_length} bytes...${NC}"
            new_secret=$(generate_secret "$new_length")
            GENERATED_SECRET="$new_secret"
            display_secret "$new_secret" "$new_length"
            show_menu "$new_secret"
            ;;
        "Copy secret to clipboard")
            echo ""
            copy_to_clipboard "$secret"
            echo ""
            read -rp "$(echo -e "${CYAN}Press Enter to continue...${NC}")"
            display_secret "$secret" "$((${#secret} / 2))"
            show_menu "$secret"
            ;;
        "Exit")
            echo ""
            echo -e "${GREEN}Thank you for using JWT Secret Generator!${NC}"
            echo -e "${YELLOW}Remember: Keep your secrets secure! 🔐${NC}"
            echo ""
            exit 0
            ;;
    esac
}

# Fallback menu for systems without fzf
show_menu_fallback() {
    local secret=$1

    echo -e "${BOLD}What would you like to do?${NC}"
    echo ""
    echo "1) Add/Replace secret in .env file"
    echo "2) Regenerate a new secret key"
    echo "3) Copy secret to clipboard"
    echo "4) Exit"
    echo ""
    echo -n "$(echo -e "${CYAN}Select option (1-4): ${NC}")"
    read -r choice

    case "$choice" in
        1)
            echo ""
            update_env_file "$secret"
            echo ""
            read -rp "$(echo -e "${CYAN}Press Enter to continue...${NC}")"
            display_secret "$secret" "$((${#secret} / 2))"
            show_menu_fallback "$secret"
            ;;
        2)
            echo ""
            new_length=$(ask_for_length "$DEFAULT_LENGTH")
            echo -e "${GREEN}Generating new secret with ${new_length} bytes...${NC}"
            new_secret=$(generate_secret "$new_length")
            GENERATED_SECRET="$new_secret"
            display_secret "$new_secret" "$new_length"
            show_menu_fallback "$new_secret"
            ;;
        3)
            echo ""
            copy_to_clipboard "$secret"
            echo ""
            read -rp "$(echo -e "${CYAN}Press Enter to continue...${NC}")"
            display_secret "$secret" "$((${#secret} / 2))"
            show_menu_fallback "$secret"
            ;;
        4)
            echo ""
            echo -e "${GREEN}Thank you for using JWT Secret Generator!${NC}"
            echo -e "${YELLOW}Remember: Keep your secrets secure! 🔐${NC}"
            echo ""
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option. Please select 1-4${NC}"
            echo ""
            read -rp "$(echo -e "${CYAN}Press Enter to continue...${NC}")"
            display_secret "$secret" "$((${#secret} / 2))"
            show_menu_fallback "$secret"
            ;;
    esac
}

# Function to display initial info
show_intro() {
    clear
    echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}${BOLD}           JWT Secret Key Generator${NC}"
    echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${BLUE}This tool will generate a cryptographically secure random${NC}"
    echo -e "${BLUE}secret key for your JWT authentication.${NC}"
    echo ""
    echo -e "${YELLOW}Security Tips:${NC}"
    echo -e "  • Keep this secret secure and never commit to git"
    echo -e "  • Use different secrets for dev, staging, and production"
    echo -e "  • Minimum recommended length: 32 bytes (64 hex chars)"
    echo -e "  • Store production secrets in a secure secrets manager"
    echo ""
}

# Main script
main() {
    # Change to project root
    cd "$PROJECT_ROOT"

    # Show intro
    show_intro

    # Get length (from argument or prompt)
    local length
    if [[ -n "$1" ]] && [[ "$1" =~ ^[0-9]+$ ]]; then
        length=$1
        if [[ "$length" -lt "$MIN_LENGTH" ]]; then
            echo -e "${YELLOW}Length too short. Using minimum: ${MIN_LENGTH}${NC}"
            length=$MIN_LENGTH
        fi
    else
        length=$(ask_for_length "$DEFAULT_LENGTH")
    fi

    # Generate the secret
    echo ""
    echo -e "${GREEN}Generating secure JWT secret key...${NC}"
    sleep 0.5
    GENERATED_SECRET=$(generate_secret "$length")

    if [[ -z "$GENERATED_SECRET" ]]; then
        echo -e "${RED}Error: Failed to generate secret${NC}"
        exit 1
    fi

    # Display and show menu
    display_secret "$GENERATED_SECRET" "$length"
    show_menu "$GENERATED_SECRET"
}

# Run the script
main "$@"
