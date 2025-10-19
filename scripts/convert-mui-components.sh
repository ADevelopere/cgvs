#!/bin/bash

# Script to convert MUI components to MUI.Component format
# This script asks for a file path and runs the TypeScript conversion script using bun

set -e

# Add bun to PATH if not already available
export PATH="$HOME/.bun/bin:$PATH"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}MUI Component Converter${NC}"
echo -e "${BLUE}======================${NC}"
echo ""

# Function to validate file path
validate_file() {
    local file_path="$1"

    # Check if file exists
    if [[ ! -f "$file_path" ]]; then
        echo -e "${RED}Error: File '$file_path' does not exist.${NC}"
        return 1
    fi

    # Check if it's a TypeScript/TSX file
    if [[ ! "$file_path" =~ \.(tsx?|jsx?)$ ]]; then
        echo -e "${RED}Error: File must be a TypeScript/TSX file (.ts, .tsx, .js, .jsx).${NC}"
        return 1
    fi

    # Check if file contains MUI components
    if ! grep -q "@mui/material" "$file_path" 2>/dev/null; then
        echo -e "${YELLOW}Warning: File doesn't appear to import from @mui/material.${NC}"
        read -p "Continue anyway? (y/N): " continue_choice
        if [[ ! "$continue_choice" =~ ^[Yy]$ ]]; then
            return 1
        fi
    fi

    return 0
}

# Function to get file path from user
get_file_path() {
    # Check if file path is provided as argument
    if [[ $# -gt 0 ]]; then
        local file_path="$1"
        # Expand tilde and resolve relative paths
        file_path=$(eval echo "$file_path")

        if validate_file "$file_path"; then
            echo "$file_path"
            return 0
        else
            echo -e "${RED}Invalid file path provided: $1${NC}"
            exit 1
        fi
    fi

    # Check if we have piped input
    if [[ ! -t 0 ]]; then
        read file_path
        if [[ -z "$file_path" ]]; then
            echo -e "${RED}No file path provided in input.${NC}"
            exit 1
        fi
    else
        # Interactive mode
        while true; do
            echo -e "${YELLOW}Enter the file path to convert:${NC}"
            read -p "> " file_path

            # Handle empty input
            if [[ -z "$file_path" ]]; then
                echo -e "${RED}Please enter a valid file path.${NC}"
                continue
            fi
            break
        done
    fi

    # Expand tilde and resolve relative paths
    file_path=$(eval echo "$file_path")

    if validate_file "$file_path"; then
        echo "$file_path"
        return 0
    else
        echo -e "${RED}Invalid file path: $file_path${NC}"
        exit 1
    fi
}

# Main execution
main() {
    # Check if bun is installed
    if ! command -v bun &> /dev/null; then
        echo -e "${RED}Error: bun is not installed or not in PATH.${NC}"
        echo -e "${YELLOW}Please install bun first: https://bun.sh/docs/installation${NC}"
        exit 1
    fi

    # Get file path from user
    file_path=$(get_file_path "$@")

    echo ""
    echo -e "${BLUE}Converting MUI components in:${NC} $file_path"
    echo ""

    # Get the directory of this script
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    typescript_script="$script_dir/convert-mui-components.ts"

    # Check if TypeScript script exists
    if [[ ! -f "$typescript_script" ]]; then
        echo -e "${RED}Error: TypeScript script not found at: $typescript_script${NC}"
        exit 1
    fi

    # Run the TypeScript script with bun
    echo -e "${YELLOW}Running conversion script...${NC}"

    if bun run "$typescript_script" "$file_path"; then
        echo ""
        echo -e "${GREEN}✅ Conversion completed successfully!${NC}"
        echo -e "${GREEN}MUI components have been converted to MUI.Component format.${NC}"
    else
        echo ""
        echo -e "${RED}❌ Conversion failed. Please check the error messages above.${NC}"
        exit 1
    fi
}

# Run main function
main "$@"
