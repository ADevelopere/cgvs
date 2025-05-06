#!/bin/bash

# Array of available commands
commands=(
    "Start PHP Server"
    "Run Database Seeder"
    "Fresh Database Migration"
    "Start Vite Dev Server"
    "Exit"
)

# Command implementations
function execute_command() {
    case $1 in
        "Start PHP Server")
            php -c php.ini artisan serve
            ;;
        "Run Database Seeder")
            php artisan db:seed
            ;;
        "Fresh Database Migration")
            php artisan migrate:fresh
            ;;
        "Start Vite Dev Server")
            bun run dev
            ;;
        "Exit")
            exit 0
            ;;
    esac
}

# Initialize selection
selected=0
total=${#commands[@]}

# ANSI escape codes for colors and cursor manipulation
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'  # No Color

while true; do
    # Clear screen
    clear
    
    echo "Use ↑↓ arrows to navigate, Enter to select, or q to quit"
    echo "----------------------------------------"
    
    # Display all commands
    for i in "${!commands[@]}"; do
        if [ $i -eq $selected ]; then
            echo -e "${GREEN}> ${commands[$i]}${NC}"
        else
            echo "  ${commands[$i]}"
        fi
    done

    # Read a single character
    read -s -n 1 key

    # Handle special keys
    if [[ $key = "" ]]; then  # Enter key
        clear
        echo "Executing: ${commands[$selected]}"
        echo "----------------------------------------"
        execute_command "${commands[$selected]}"
        echo "----------------------------------------"
        echo "Press any key to return to menu..."
        read -n 1
    elif [[ $key = "A" ]]; then  # Up arrow
        if [ $selected -gt 0 ]; then
            selected=$((selected - 1))
        fi
    elif [[ $key = "B" ]]; then  # Down arrow
        if [ $selected -lt $((total - 1)) ]; then
            selected=$((selected + 1))
        fi
    elif [[ $key = "q" ]]; then  # Quit
        exit 0
    fi
done
