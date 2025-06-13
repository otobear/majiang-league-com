use axum::{
    routing::{get},
    Json, Router,
};
use serde::{Deserialize, Serialize};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let app = Router::new()
        .route("/", get(root))
        .route("/players", get(get_players));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000")
        .await
        .expect("Failed to bind TCP listener");
    axum::serve(listener, app)
        .await
        .expect("Failed to start server");
}

async fn root() -> &'static str {
    "Welcome to the Axum server!"
}

async fn get_players() -> Json<Vec<Player>> {
    let players = vec![
        Player { id: 1, name: "Alice".to_string(), score: 100 },
        Player { id: 2, name: "Bob".to_string(), score: 200 },
    ];
    Json(players)
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Player {
    id: u32,
    name: String,
    score: u32,
}
