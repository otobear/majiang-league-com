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
use chrono::{NaiveDate};

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

#[derive(Serialize, Deserialize, Debug, ToSchema)]
struct PlayerGameResult {
    player_id: i32,
    player_name: String,
    game_point: i32,
    table_point: i32,
    place_point: i32,
}

#[derive(Serialize, Deserialize, sqlx::FromRow, Debug)]
struct GameDetailRaw {
    game_id: i32,
    tournament_name: String,
    tournament_sub_name: String,
    tournament_date: NaiveDate,
    tournament_location: String,
    session_name: String,
    players: serde_json::Value,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
struct GameDetail {
    game_id: i32,
    tournament_name: String,
    tournament_sub_name: String,
    #[schema(value_type = String, format = Date)]
    tournament_date: NaiveDate,
    tournament_location: String,
    session_name: String,
    players: Vec<PlayerGameResult>,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
struct PlayerStatsWithGames {
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
    game_details: Vec<GameDetail>,
}

async fn health() -> Json<serde_json::Value> {
    Json(serde_json::json!({ "status": "ok" }))
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:password@localhost:5432/majiang?sslmode=require".to_string());
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
        .route("/health", get(health))
        .nest("/v1", api_routes)
        .with_state(pool)
        .layer(cors);

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
    path = "/v1/player_stats",
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
    path = "/v1/player_stats/{player_id}",
    params(
        ("player_id" = i32, Path, description = "玩家ID")
    ),
    responses(
        (status = 200, description = "玩家统计和比赛详情", body = PlayerStatsWithGames),
        (status = 404, description = "玩家未找到")
    )
)]
async fn get_player_stats(
    State(pool): State<PgPool>,
    axum::extract::Path(player_id): axum::extract::Path<i32>,
) -> Result<Json<PlayerStatsWithGames>, axum::http::StatusCode> {
    // 获取玩家统计信息
    let stats = sqlx::query_as::<_, PlayerStats>("SELECT * FROM player_stats WHERE player_id = $1")
        .bind(player_id)
        .fetch_one(&pool)
        .await
        .map_err(|_| axum::http::StatusCode::NOT_FOUND)?;

    // 获取玩家的所有比赛详情，包含同桌其他玩家
    let game_details_raw = sqlx::query_as::<_, GameDetailRaw>(
        r#"
        SELECT 
            g.id as game_id,
            t.name as tournament_name,
            t.sub_name as tournament_sub_name,
            t.date as tournament_date,
            t.location as tournament_location,
            s.name as session_name,
            json_agg(json_build_object(
                'player_id', gpr_all.player_id,
                'player_name', p_all.name,
                'game_point', gpr_all.game_point,
                'table_point', gpr_all.table_point,
                'place_point', CASE gpr_all.table_point
                    WHEN 4 THEN 3
                    WHEN 3 THEN 1
                    WHEN 2 THEN -1
                    WHEN 1 THEN -3
                    ELSE 0
                END
            ) ORDER BY gpr_all.id) as players
        FROM (
            SELECT DISTINCT g.id
            FROM games g
            JOIN game_player_results gpr ON gpr.game_id = g.id
            WHERE gpr.player_id = $1
        ) player_games
        JOIN games g ON g.id = player_games.id
        JOIN sessions s ON g.session_id = s.id
        JOIN tournaments t ON s.tournament_id = t.id
        JOIN game_player_results gpr_all ON gpr_all.game_id = g.id
        JOIN players p_all ON gpr_all.player_id = p_all.id
        GROUP BY g.id, t.name, t.sub_name, t.date, t.location, s.name
        ORDER BY g.id ASC
        "#
    )
    .bind(player_id)
    .fetch_all(&pool)
    .await
    .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;

    // 转换为最终格式
    let game_details: Result<Vec<GameDetail>, axum::http::StatusCode> = game_details_raw
        .into_iter()
        .map(|raw| -> Result<GameDetail, axum::http::StatusCode> {
            let players: Vec<PlayerGameResult> = serde_json::from_value(raw.players)
                .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
            Ok(GameDetail {
                game_id: raw.game_id,
                tournament_name: raw.tournament_name,
                tournament_sub_name: raw.tournament_sub_name,
                tournament_date: raw.tournament_date,
                tournament_location: raw.tournament_location,
                session_name: raw.session_name,
                players,
            })
        })
        .collect();
    let games = game_details?;

    let result = PlayerStatsWithGames {
        player_id: stats.player_id,
        player_name: stats.player_name,
        game_count: stats.game_count,
        total_gp: stats.total_gp,
        total_tp: stats.total_tp,
        total_rp: stats.total_rp,
        first_place_count: stats.first_place_count,
        second_place_count: stats.second_place_count,
        third_place_count: stats.third_place_count,
        fourth_place_count: stats.fourth_place_count,
        avg_gp: stats.avg_gp,
        avg_tp: stats.avg_tp,
        avg_rp: stats.avg_rp,
        first_place_ratio: stats.first_place_ratio,
        second_place_ratio: stats.second_place_ratio,
        third_place_ratio: stats.third_place_ratio,
        fourth_place_ratio: stats.fourth_place_ratio,
        game_details: games,
    };

    Ok(Json(result))
}

#[derive(OpenApi)]
#[openapi(
    paths(get_player_stats_list, get_player_stats),
    components(schemas(PlayerStats, PlayerStatsWithGames, GameDetail, PlayerGameResult))
)]
struct ApiDoc;
