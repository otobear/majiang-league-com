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
    total_tp: Option<f32>,
    total_pp: Option<f32>,
    first_place_count: Option<i64>,
    second_place_count: Option<i64>,
    third_place_count: Option<i64>,
    fourth_place_count: Option<i64>,
    avg_gp: Option<f32>,
    avg_tp: Option<f32>,
    avg_pp: Option<f32>,
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
    table_point: f32,
    place_point: f32,
}

#[derive(Serialize, Deserialize, sqlx::FromRow, Debug)]
struct GameDetailRaw {
    game_id: i32,
    tournament_id: i32,
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
    tournament_id: i32,
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
    #[serde(flatten)]
    #[schema(inline)]
    stats: PlayerStats,
    game_details: Vec<GameDetail>,
}

#[derive(Serialize, Deserialize, sqlx::FromRow, Debug, ToSchema)]
struct Tournament {
    id: i32,
    name: String,
    sub_name: String,
    #[schema(value_type = String, format = Date)]
    date: NaiveDate,
    location: String,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
struct TournamentSummary {
    player_id: i32,
    player_name: String,
    tournament_place: i32,
    total_point: TotalPoint,
    round_point: Vec<RoundPoint>,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
struct TotalPoint {
    table_point: f32,
    game_point: i32,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
struct RoundPoint {
    table_point: f32,
    game_point: i32,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
struct SessionInfo {
    id: i32,
    name: String,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
struct GameInfo {
    id: i32,
    forfeit_game_point: i32,
    player_results: Vec<PlayerGameResult>,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
struct SessionDetail {
    info: SessionInfo,
    games: Vec<GameInfo>,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
struct TournamentDetail {
    id: i32,
    info: Tournament,
    summary: Vec<TournamentSummary>,
    sessions: Vec<SessionDetail>,
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
        .route("/player_stats/:player_id", get(get_player_stats))
        .route("/tournaments", get(get_tournaments))
        .route("/tournaments/:tournament_id", get(get_tournament));

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
    let stats = sqlx::query_as::<_, PlayerStats>("SELECT * FROM player_stats WHERE player_id = $1")
        .bind(player_id)
        .fetch_one(&pool)
        .await
        .map_err(|_| axum::http::StatusCode::NOT_FOUND)?;

    let game_details_raw = sqlx::query_as::<_, GameDetailRaw>(
        r#"
        SELECT 
            g.id as game_id,
            t.id as tournament_id,
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
                'place_point', (gpr_all.table_point * 2 - 5)
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
        GROUP BY g.id, t.id, t.name, t.sub_name, t.date, t.location, s.name
        ORDER BY g.id ASC
        "#
    )
    .bind(player_id)
    .fetch_all(&pool)
    .await
    .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;

    let game_details: Result<Vec<GameDetail>, axum::http::StatusCode> = game_details_raw
        .into_iter()
        .map(|raw| -> Result<GameDetail, axum::http::StatusCode> {
            let players: Vec<PlayerGameResult> = serde_json::from_value(raw.players)
                .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
            Ok(GameDetail {
                game_id: raw.game_id,
                tournament_id: raw.tournament_id,
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
        stats,
        game_details: games,
    };

    Ok(Json(result))
}

#[utoipa::path(
    get,
    path = "/v1/tournaments",
    responses(
        (status = 200, description = "Tournament list with details", body = [TournamentDetail])
    )
)]
async fn get_tournaments(
    State(pool): State<PgPool>,
) -> Json<Vec<TournamentDetail>> {
    let tournaments = sqlx::query_as::<_, Tournament>("SELECT id, name, sub_name, date, location FROM tournaments ORDER BY date DESC")
        .fetch_all(&pool)
        .await
        .expect("Failed to fetch tournaments");

    let mut tournament_details = Vec::new();
    
    for tournament in tournaments {
        match get_tournament_detail(&pool, tournament.id).await {
            Ok(detail) => tournament_details.push(detail),
            Err(_) => {
                tournament_details.push(TournamentDetail {
                    id: tournament.id,
                    info: tournament,
                    summary: Vec::new(),
                    sessions: Vec::new(),
                });
            }
        }
    }

    Json(tournament_details)
}

async fn get_tournament_detail(pool: &PgPool, tournament_id: i32) -> Result<TournamentDetail, axum::http::StatusCode> {
    let tournament = sqlx::query_as::<_, Tournament>(
        "SELECT id, name, sub_name, date, location FROM tournaments WHERE id = $1"
    )
    .bind(tournament_id)
    .fetch_one(pool)
    .await
    .map_err(|_| axum::http::StatusCode::NOT_FOUND)?;

    #[derive(sqlx::FromRow)]
    struct SummaryRow {
        player_id: i32,
        player_name: String,
        total_table_point: Option<f32>,
        total_game_point: Option<i64>,
        tournament_place: Option<i64>,
    }

    let summary_raw = sqlx::query_as::<_, SummaryRow>(
        r#"
        SELECT 
            p.id as player_id,
            p.name as player_name,
            COALESCE(SUM(gpr.table_point), 0) as total_table_point,
            COALESCE(SUM(gpr.game_point), 0) as total_game_point,
            ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(gpr.table_point), 0) DESC, COALESCE(SUM(gpr.game_point), 0) DESC) as tournament_place
        FROM players p
        JOIN game_player_results gpr ON p.id = gpr.player_id
        JOIN games g ON gpr.game_id = g.id
        JOIN sessions s ON g.session_id = s.id
        WHERE s.tournament_id = $1
        GROUP BY p.id, p.name
        ORDER BY total_table_point DESC, total_game_point DESC
        "#
    )
    .bind(tournament_id)
    .fetch_all(pool)
    .await
    .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;

    #[derive(sqlx::FromRow)]
    struct RoundPointRow {
        player_id: i32,
        session_name: String,
        session_table_point: Option<f32>,
        session_game_point: Option<i64>,
    }

    let round_points_raw = sqlx::query_as::<_, RoundPointRow>(
        r#"
        SELECT 
            p.id as player_id,
            s.name as session_name,
            COALESCE(SUM(gpr.table_point), 0) as session_table_point,
            COALESCE(SUM(gpr.game_point), 0) as session_game_point
        FROM players p
        JOIN game_player_results gpr ON p.id = gpr.player_id
        JOIN games g ON gpr.game_id = g.id
        JOIN sessions s ON g.session_id = s.id
        WHERE s.tournament_id = $1
        GROUP BY p.id, s.id, s.name
        ORDER BY p.id, s.id
        "#
    )
    .bind(tournament_id)
    .fetch_all(pool)
    .await
    .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;

    let mut summary: Vec<TournamentSummary> = Vec::new();
    for player_summary in summary_raw {
        let player_rounds: Vec<RoundPoint> = round_points_raw
            .iter()
            .filter(|r| r.player_id == player_summary.player_id)
            .map(|r| RoundPoint {
                table_point: r.session_table_point.unwrap_or(0.0),
                game_point: r.session_game_point.unwrap_or(0) as i32,
            })
            .collect();

        summary.push(TournamentSummary {
            player_id: player_summary.player_id,
            player_name: player_summary.player_name,
            tournament_place: player_summary.tournament_place.unwrap_or(0) as i32,
            total_point: TotalPoint {
                table_point: player_summary.total_table_point.unwrap_or(0.0),
                game_point: player_summary.total_game_point.unwrap_or(0) as i32,
            },
            round_point: player_rounds,
        });
    }

    #[derive(sqlx::FromRow)]
    struct SessionRow {
        session_id: i32,
        session_name: String,
        game_id: i32,
        forfeit_game_point: Option<i32>,
        player_results: Option<serde_json::Value>,
    }

    let sessions_raw = sqlx::query_as::<_, SessionRow>(
        r#"
        SELECT 
            s.id as session_id,
            s.name as session_name,
            g.id as game_id,
            g.forfeit_game_point,
            json_agg(json_build_object(
                'player_id', gpr.player_id,
                'player_name', p.name,
                'table_point', gpr.table_point,
                'game_point', gpr.game_point
            ) ORDER BY gpr.id) as player_results
        FROM sessions s
        JOIN games g ON g.session_id = s.id
        JOIN game_player_results gpr ON gpr.game_id = g.id
        JOIN players p ON gpr.player_id = p.id
        WHERE s.tournament_id = $1
        GROUP BY s.id, s.name, g.id, g.forfeit_game_point
        ORDER BY s.id, g.id
        "#
    )
    .bind(tournament_id)
    .fetch_all(pool)
    .await
    .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;

    let mut sessions: Vec<SessionDetail> = Vec::new();
    let mut current_session: Option<SessionDetail> = None;

    for session_data in sessions_raw {
        let player_results_json: Vec<serde_json::Value> = serde_json::from_value(session_data.player_results.unwrap_or(serde_json::Value::Null))
            .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
        
        let player_results: Vec<PlayerGameResult> = player_results_json
            .into_iter()
            .map(|result: serde_json::Value| PlayerGameResult {
                player_id: result["player_id"].as_i64().unwrap_or(0) as i32,
                player_name: result["player_name"].as_str().unwrap_or("").to_string(),
                table_point: result["table_point"].as_f64().unwrap_or(0.0) as f32,
                game_point: result["game_point"].as_i64().unwrap_or(0) as i32,
                place_point: (result["table_point"].as_f64().unwrap_or(0.0) as f32 * 2.0 - 5.0),
            })
            .collect();

        let game = GameInfo {
            id: session_data.game_id,
            forfeit_game_point: session_data.forfeit_game_point.unwrap_or(0),
            player_results,
        };

        if let Some(ref mut session) = current_session {
            if session.info.id == session_data.session_id {
                session.games.push(game);
            } else {
                sessions.push(current_session.take().unwrap());
                current_session = Some(SessionDetail {
                    info: SessionInfo {
                        id: session_data.session_id,
                        name: session_data.session_name,
                    },
                    games: vec![game],
                });
            }
        } else {
            current_session = Some(SessionDetail {
                info: SessionInfo {
                    id: session_data.session_id,
                    name: session_data.session_name,
                },
                games: vec![game],
            });
        }
    }

    if let Some(session) = current_session {
        sessions.push(session);
    }

    let result = TournamentDetail {
        id: tournament.id,
        info: tournament,
        summary,
        sessions,
    };

    Ok(result)
}

#[utoipa::path(
    get,
    path = "/v1/tournaments/{tournament_id}",
    params(
        ("tournament_id" = i32, Path, description = "Tournament ID")
    ),
    responses(
        (status = 200, description = "Tournament detail", body = TournamentDetail),
        (status = 404, description = "Tournament not found")
    )
)]
async fn get_tournament(
    State(pool): State<PgPool>,
    axum::extract::Path(tournament_id): axum::extract::Path<i32>,
) -> Result<Json<TournamentDetail>, axum::http::StatusCode> {
    let detail = get_tournament_detail(&pool, tournament_id).await?;
    Ok(Json(detail))
}

#[derive(OpenApi)]
#[openapi(
    paths(get_player_stats_list, get_player_stats, get_tournaments, get_tournament),
    components(schemas(
        PlayerStats, 
        PlayerStatsWithGames, 
        GameDetail, 
        PlayerGameResult,
        Tournament,
        TournamentDetail,
        TournamentSummary,
        TotalPoint,
        RoundPoint,
        SessionDetail,
        SessionInfo,
        GameInfo
    ))
)]
struct ApiDoc;
