#!/usr/bin/env zsh

# Exit on error
setopt ERR_EXIT

# Enable extended globbing
setopt EXTENDED_GLOB

echo "Clearing route cache..."
php artisan route:clear

echo "Building frontend assets..."
bun run build

echo "Starting development server..."
php artisan serve