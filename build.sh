#!/bin/bash
set -e

# Define a local directory for binaries
BIN_DIR="/workspace/bin"
mkdir -p "$BIN_DIR"

echo "Downloading FFmpeg..."
curl -L https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz -o ffmpeg.tar.xz

echo "Extracting FFmpeg..."
tar -xf ffmpeg.tar.xz
mv ffmpeg-*-static/ffmpeg "$BIN_DIR/ffmpeg"
mv ffmpeg-*-static/ffprobe "$BIN_DIR/ffprobe"
chmod +x "$BIN_DIR/ffmpeg"
chmod +x "$BIN_DIR/ffprobe"

echo "FFmpeg installed successfully in $BIN_DIR."

# Set path for runtime use (optional, but useful for Laravel)
echo "export PATH=$BIN_DIR:\$PATH" >> ~/.profile
source ~/.profile

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
