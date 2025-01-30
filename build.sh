#!/bin/bash
set -e

echo "Downloading FFmpeg..."
curl -L https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz -o ffmpeg.tar.xz

echo "Extracting FFmpeg..."
tar -xf ffmpeg.tar.xz

echo "Moving FFmpeg binary..."
mv ffmpeg-*-static/ffmpeg /usr/local/bin/ffmpeg
mv ffmpeg-*-static/ffprobe /usr/local/bin/ffprobe
chmod +x /usr/local/bin/ffmpeg
chmod +x /usr/local/bin/ffprobe

echo "FFmpeg installed successfully."

# Laravel setup
echo "Clearing caches..."
php artisan cache:clear

echo "Caching configuration..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

echo "Caching views..."
php artisan view:cache

echo "Running migrations..."
php artisan migrate --force

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm ci --no-progress --no-audit --prefer-offline

# Compile assets for production
echo "Compiling assets for production..."
npm run build

echo "Build process completed."
