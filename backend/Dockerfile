FROM rust:1.87 AS builder
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y pkg-config libssl-dev
RUN cargo install sqlx-cli --no-default-features --features postgres,native-tls
RUN cargo build --release

FROM debian:bookworm-slim
WORKDIR /app

RUN apt-get update && apt-get install -y \
    libssl3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/backend /app/backend
COPY --from=builder /app/openapi.json /app/openapi.json
COPY --from=builder /usr/local/cargo/bin/sqlx /usr/local/bin/sqlx
COPY --from=builder /app/migrations /app/migrations
COPY setup-db.sh /app/setup-db.sh

RUN chmod +x /app/setup-db.sh

ENV RUST_LOG=info
CMD ["/app/setup-db.sh", "/app/backend"]
