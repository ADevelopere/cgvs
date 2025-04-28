#!/usr/bin/env zsh

# Exit on error
setopt ERR_EXIT

# Enable extended globbing
setopt EXTENDED_GLOB

echo "Clearing route cache..."
php artisan route:clear
php artisan view:clear 
php artisan config:clear
php artisan cache:clear
php artisan optimize:clear
php artisan optimize
php artisan clear-compiled
php artisan optimize:clear
php artisan optimize

echo "Building frontend assets..."
bun dev

echo "Starting development server..."
php artisan serve