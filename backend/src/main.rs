use axum::{
    extract::State,
    routing::{get},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgPool};
use utoipa::{OpenApi, ToSchema};
use axum::http::Method;
use tower_http::cors::{CorsLayer, Any};

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
    total_rp: Option<i64>,
    first_place_count: Option<i64>,
    second_place_count: Option<i64>,
    third_place_count: Option<i64>,
    fourth_place_count: Option<i64>,
    avg_gp: Option<f32>,
    avg_tp: Option<f32>,
    avg_rp: Option<f32>,
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
        .route("/player_stats", get(get_player_stats_list))
        .route("/player_stats/:player_id", get(get_player_stats));

    // TODO: set up Swagger UI
    // let swagger_ui = SwaggerUi::new("/swagger-ui").url("/api-doc/openapi.json", ApiDoc::openapi());

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers(Any);

    let app = Router::new()
        .nest("/api/v1", api_routes)
        .with_state(pool)
        .layer(cors); // 添加 CORS 中间件

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
    path = "/api/v1/player_stats",
    responses(
        (status = 200, description = "玩家统计", body = [PlayerStats])
    )
)]
async fn get_player_stats_list(
    State(pool): State<PgPool>,
) -> Json<Vec<PlayerStats>> {
    let stats = sqlx::query_as::<_, PlayerStats>("SELECT * FROM player_stats")
        .fetch_all(&pool)
        .await
        .expect("Failed to fetch player stats");

    Json(stats)
}

#[utoipa::path(
    get,
    path = "/api/v1/player_stats/{player_id}",
    params(
        ("player_id" = i32, Path, description = "玩家ID")
    ),
    responses(
        (status = 200, description = "玩家统计", body = PlayerStats),
        (status = 404, description = "玩家未找到")
    )
)]
async fn get_player_stats(
    State(pool): State<PgPool>,
    axum::extract::Path(player_id): axum::extract::Path<i32>,
) -> Result<Json<PlayerStats>, axum::http::StatusCode> {
    let stats = sqlx::query_as::<_, PlayerStats>("SELECT * FROM player_stats WHERE player_id = $1")
        .bind(player_id)
        .fetch_one(&pool)
        .await
        .map_err(|_| axum::http::StatusCode::NOT_FOUND)?;

    Ok(Json(stats))
}

#[derive(OpenApi)]
#[openapi(
    paths(get_player_stats_list, get_player_stats),
    components(schemas(PlayerStats, PlayerStats))
)]
struct ApiDoc;