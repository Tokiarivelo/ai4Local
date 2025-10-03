use axum::{
    extract::{Query, State},
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tracing::info;

mod config;
mod services;
mod models;

use config::AppConfig;
use services::ai_service::AIService;

#[derive(Clone)]
pub struct AppState {
    ai_service: Arc<AIService>,
}

#[derive(Deserialize)]
struct ContentRequest {
    prompt: String,
    content_type: String,
    language: String,
    company_id: String,
}

#[derive(Serialize)]
struct ContentResponse {
    id: String,
    content: String,
    status: String,
    created_at: String,
}

#[derive(Serialize)]
struct HealthResponse {
    status: String,
    version: String,
}

// Route de santé
async fn health() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "OK".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    })
}

// Route de génération de contenu
async fn generate_content(
    State(state): State<AppState>,
    Json(request): Json<ContentRequest>,
) -> Result<Json<ContentResponse>, StatusCode> {
    info!("Génération de contenu: type={}, langue={}", request.content_type, request.language);
    
    match state.ai_service.generate_content(&request.prompt, &request.content_type, &request.language).await {
        Ok(content) => {
            let response = ContentResponse {
                id: uuid::Uuid::new_v4().to_string(),
                content,
                status: "completed".to_string(),
                created_at: chrono::Utc::now().to_rfc3339(),
            };
            Ok(Json(response))
        }
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Configuration du logging
    tracing_subscriber::fmt()
        .with_target(false)
        .compact()
        .init();

    // Chargement de la configuration
    let config = AppConfig::load()?;
    info!("Configuration chargée, port: {}", config.port);

    // Initialisation des services
    let ai_service = Arc::new(AIService::new(&config).await?);
    
    let app_state = AppState { ai_service };

    // Configuration des routes
    let app = Router::new()
        .route("/health", get(health))
        .route("/api/v1/content/generate", post(generate_content))
        .with_state(app_state)
        .layer(
            tower_http::cors::CorsLayer::new()
                .allow_origin(tower_http::cors::Any)
                .allow_methods(tower_http::cors::Any)
                .allow_headers(tower_http::cors::Any),
        )
        .layer(tower_http::trace::TraceLayer::new_for_http());

    // Démarrage du serveur
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", config.port)).await?;
    info!("🦀 AI Content Service démarré sur le port {}", config.port);
    
    axum::serve(listener, app).await?;

    Ok(())
}