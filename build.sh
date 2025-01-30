#!/bin/bash

# Ensure the script stops if any command fails
set -e

echo "Updating package lists..."
apt-get update

echo "Installing FFmpeg..."
apt-get install -y ffmpeg

echo "FFmpeg installed successfully."

# Clear existing caches
echo "Clearing caches..."
php artisan cache:clear

# Optimize for production
echo "Caching configuration..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

echo "Caching views..."
php artisan view:cache

# Compile assets for production
echo "Compiling assets for production..."
echo "Installing frontend dependencies..."
npm ci --no-progress --no-audit --prefer-offlines
npm run build

# You might want to check file permissions here, but this is often handled by the deployment environment
echo "File permissions should be checked post-deployment if needed."

# Optionally, run tests in a staging environment
# echo "Running tests..."
# php artisan test

echo "Build process completed. Your Laravel application is now ready for production deployment."