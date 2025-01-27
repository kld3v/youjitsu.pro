#!/bin/bash

# Ensure the script stops if any command fails
set -e

# Navigate to your project directory if necessary
cd /home/bakura/Documents/koderovka/personal/youjitsu

# Clear existing caches
echo "Clearing caches..."
php artisan cache:clear

# Generate application key if needed
echo "Generating application key..."
php artisan key:generate

# Optimize for production
echo "Caching configuration..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

echo "Caching views..."
php artisan view:cache

# Run migrations if necessary
echo "Running migrations..."
php artisan migrate --force

# Compile assets for production
echo "Compiling assets for production..."
npm run build

# You might want to check file permissions here, but this is often handled by the deployment environment
echo "File permissions should be checked post-deployment if needed."

# Optionally, run tests in a staging environment
# echo "Running tests..."
# php artisan test

echo "Build process completed. Your Laravel application is now ready for production deployment."