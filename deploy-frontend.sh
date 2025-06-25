#!/bin/bash
set -e

# Frontend deployment with CloudFront CDN
# This script builds, uploads to S3, and invalidates CloudFront cache

echo "=== Frontend CDN Deployment ==="

# Configuration
S3_BUCKET="majiang-league-com-frontend"
CLOUDFRONT_DISTRIBUTION_ID="E5PH3M3KLMIIV"  # From the created distribution
REGION="ap-northeast-1"

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
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

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Step 1: Build frontend
print_info "Building frontend for production..."
cd frontend

# Show API configuration
if [ -f ".env.production" ]; then
    print_info "Using production environment configuration"
    API_URL=$(grep VITE_API_BASE_URL .env.production | cut -d'=' -f2)
    print_info "API Base URL: $API_URL"
else
    print_warning ".env.production not found, using default configuration"
fi

# Build the application
print_info "Building with production mode..."
pnpm build --mode production

if [ ! -d "dist" ]; then
    print_error "Build failed - dist directory not found"
    exit 1
fi

print_success "Build completed successfully"

# Step 2: Upload to S3 with cache-friendly headers
print_info "Uploading files to S3 with optimized cache headers..."

# Upload assets (JS, CSS, images) with long cache (1 year)
print_info "Uploading assets with long-term caching..."
aws s3 sync dist/assets/ "s3://$S3_BUCKET/assets/" \
    --delete \
    --cache-control "max-age=31536000, public, immutable" \
    --metadata-directive REPLACE

# Upload HTML files with no cache
print_info "Uploading HTML files with no-cache headers..."
aws s3 cp dist/index.html "s3://$S3_BUCKET/index.html" \
    --cache-control "max-age=0, no-cache, no-store, must-revalidate" \
    --metadata-directive REPLACE

# Upload other files (favicon, etc.)
print_info "Uploading other static files..."
aws s3 sync dist/ "s3://$S3_BUCKET/" \
    --exclude "assets/*" \
    --exclude "index.html" \
    --cache-control "max-age=86400, public" \
    --metadata-directive REPLACE

print_success "Files uploaded to S3 successfully"

cd ..

# Step 3: Invalidate CloudFront cache
print_info "Invalidating CloudFront cache..."
INVALIDATION_OUTPUT=$(aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "/*" \
    --output json)

INVALIDATION_ID=$(echo "$INVALIDATION_OUTPUT" | jq -r '.Invalidation.Id')
print_success "CloudFront invalidation created: $INVALIDATION_ID"

# Step 4: Show deployment information
print_success "=== Deployment Completed Successfully ==="
echo ""
print_info "Access URLs:"
echo "  🌐 S3 Direct: http://$S3_BUCKET.s3-website-$REGION.amazonaws.com"
echo "  🚀 CloudFront CDN: https://dy00ox3inox0i.cloudfront.net"
echo ""
print_info "CloudFront Features:"
echo "  ✅ HTTPS enabled"
echo "  ✅ Global edge locations"
echo "  ✅ Gzip compression"
echo "  ✅ Optimized caching (assets: 1 year, HTML: no cache)"
echo "  ✅ SPA routing support (404 → index.html)"
echo ""
print_warning "Note: CloudFront cache invalidation may take 5-15 minutes to complete"
print_info "You can check invalidation status with:"
echo "  aws cloudfront get-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --id $INVALIDATION_ID"
echo ""
print_success "🎉 Deployment complete! Your app is now available via CDN"

# Clean up
rm -f cloudfront-result.json

echo "=== End of Deployment ==="

