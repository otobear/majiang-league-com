CREATE TABLE
  IF NOT EXISTS tournaments (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    sub_name TEXT NOT NULL,
    date DATE NOT NULL,
    location TEXT NOT NULL,
    created TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    updated TIMESTAMPTZ NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER NOT NULL REFERENCES tournaments (id) ON DELETE CASCADE,
    name TEXT NOT NULL
  );

CREATE TABLE
  IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES sessions (id) ON DELETE CASCADE,
    forfeit_game_point INTEGER DEFAULT 0
  );

CREATE TABLE
  IF NOT EXISTS game_player_results (
    id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL REFERENCES games (id) ON DELETE CASCADE,
    player_id INTEGER NOT NULL REFERENCES players (id) ON DELETE CASCADE,
    game_point INTEGER NOT NULL,
    table_point FLOAT4 NOT NULL
  );

CREATE VIEW
  player_stats AS
SELECT
  p.id AS player_id,
  p.name AS player_name,
  COUNT(gpr.id) AS game_count,
  SUM(gpr.game_point) AS total_gp,
  SUM(gpr.table_point)::FLOAT4 AS total_tp,
  SUM(gpr.table_point * 2 - 5)::FLOAT4 AS total_pp,
  COUNT(*) FILTER (WHERE gpr.table_point = 4) AS first_place_count,
  COUNT(*) FILTER (WHERE gpr.table_point = 3) AS second_place_count,
  COUNT(*) FILTER (WHERE gpr.table_point = 2) AS third_place_count,
  COUNT(*) FILTER (WHERE gpr.table_point = 1) AS fourth_place_count,
  AVG(gpr.game_point)::FLOAT4 AS avg_gp,
  AVG(gpr.table_point)::FLOAT4 AS avg_tp,
  AVG(gpr.table_point * 2 - 5)::FLOAT4 AS avg_pp,
  ROUND(100.0 * COUNT(*) FILTER (WHERE gpr.table_point = 4) / NULLIF(COUNT(*),0), 2)::FLOAT4 AS first_place_ratio,
  ROUND(100.0 * COUNT(*) FILTER (WHERE gpr.table_point = 3) / NULLIF(COUNT(*),0), 2)::FLOAT4 AS second_place_ratio,
  ROUND(100.0 * COUNT(*) FILTER (WHERE gpr.table_point = 2) / NULLIF(COUNT(*),0), 2)::FLOAT4 AS third_place_ratio,
  ROUND(100.0 * COUNT(*) FILTER (WHERE gpr.table_point = 1) / NULLIF(COUNT(*),0), 2)::FLOAT4 AS fourth_place_ratio
FROM
  players p
  LEFT JOIN game_player_results gpr ON p.id = gpr.player_id
GROUP BY
  p.id,
  p.name;