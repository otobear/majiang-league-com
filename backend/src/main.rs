use axum::{
    extract::State,
    routing::{get},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgPool};
use utoipa::{OpenApi, ToSchema};

#[derive(Serialize, Deserialize, sqlx::FromRow, Debug, ToSchema)]
struct Player {
    id: i32,
    name: String,
}

#[derive(Serialize, Deserialize, sqlx::FromRow, Debug, ToSchema)]
struct PlayerStats {
    player_id: i32,
    player_name: String,
    game_count: Option<i64>,
    total_gp: Option<i64>,
    total_tp: Option<i64>,
    first_place_count: Option<i64>,
    second_place_count: Option<i64>,
    third_place_count: Option<i64>,
    fourth_place_count: Option<i64>,
    avg_gp: Option<f32>,
    avg_tp: Option<f32>,
    first_place_ratio: Option<f32>,
    second_place_ratio: Option<f32>,
    third_place_ratio: Option<f32>,
    fourth_place_ratio: Option<f32>,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:password@localhost:5432/majiang".to_string());
    let pool = PgPool::connect(&database_url)
        .await
        .expect("DB connect failed");

    let api_routes = Router::new()
        .route("/", get(root))
        .route("/players", get(get_players))
        .route("/player_stats", get(get_player_stats));

    // TODO: set up Swagger UI
    // let swagger_ui = SwaggerUi::new("/swagger-ui").url("/api-doc/openapi.json", ApiDoc::openapi());

    let app = Router::new()
        .nest("/api", api_routes)
        .with_state(pool);

    let openapi_json = ApiDoc::openapi().to_json().unwrap();
    std::fs::write("openapi.json", openapi_json).expect("Failed to write openapi.json");

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

#[utoipa::path(
    get,
    path = "/api/players",
    responses(
        (status = 200, description = "玩家列表", body = [Player])
    )
)]
async fn get_players(
    State(pool): State<PgPool>,
) -> Json<Vec<Player>> {
    let players = sqlx::query_as::<_, Player>("SELECT id, name FROM players")
        .fetch_all(&pool)
        .await
        .expect("Failed to fetch players");

    Json(players)
}

#[utoipa::path(
    get,
    path = "/api/player_stats",
    responses(
        (status = 200, description = "玩家统计", body = [PlayerStats])
    )
)]
async fn get_player_stats(
    State(pool): State<PgPool>,
) -> Json<Vec<PlayerStats>> {
    let stats = sqlx::query_as::<_, PlayerStats>("SELECT * FROM player_stats")
        .fetch_all(&pool)
        .await
        .expect("Failed to fetch player stats");

    Json(stats)
}

#[derive(OpenApi)]
#[openapi(
    paths(get_players, get_player_stats),
    components(schemas(Player, PlayerStats))
)]
struct ApiDoc;