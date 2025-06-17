export DATABASE_URL="postgres://postgres:password@localhost:5432/majiang"
sqlx database drop -y
sqlx database create
sqlx migrate run
