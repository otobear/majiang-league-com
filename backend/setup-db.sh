#!/bin/sh
set -e

echo "=== Database Setup ==="
echo "Starting database initialization..."

# TODO(only for development) Drop existing database 
# export DATABASE_URL="postgres://postgres:password@localhost:5432/majiang"
echo "Dropping existing database (if exists)..."
sqlx database drop -y 2>/dev/null || true

# Create fresh database
echo "Creating database..."
sqlx database create

# Run all migrations
echo "Running migrations..."
sqlx migrate run

echo "Database setup complete!"
echo "========================"

# Start the application
echo "Starting application server..."
exec "$@"

