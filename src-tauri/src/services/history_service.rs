use std::fs;
use std::path::PathBuf;
use log::info;

const MAX_HISTORY_SIZE: usize = 10;
const HISTORY_FILE: &str = "recent_projects.json";

/// Get the application data directory
fn get_app_data_dir() -> Result<PathBuf, String> {
    let home = dirs::home_dir().ok_or("Failed to get home directory")?;
    let app_dir = home.join(".codeview");
    
    if !app_dir.exists() {
        fs::create_dir_all(&app_dir).map_err(|e| format!("Failed to create app directory: {}", e))?;
    }
    
    Ok(app_dir)
}

/// Get the history file path
fn get_history_file() -> Result<PathBuf, String> {
    let app_dir = get_app_data_dir()?;
    Ok(app_dir.join(HISTORY_FILE))
}

pub struct HistoryService;

impl HistoryService {
    /// Load recent projects from history file
    pub fn load_history() -> Result<Vec<String>, String> {
        let history_file = get_history_file()?;
        
        if !history_file.exists() {
            return Ok(Vec::new());
        }
        
        let content = fs::read_to_string(&history_file)
            .map_err(|e| format!("Failed to read history file: {}", e))?;
        
        let projects: Vec<String> = serde_json::from_str(&content)
            .map_err(|e| format!("Failed to parse history file: {}", e))?;
        
        info!("Loaded {} projects from history", projects.len());
        Ok(projects)
    }
    
    /// Save history to file
    fn save_history(projects: &[String]) -> Result<(), String> {
        let history_file = get_history_file()?;
        
        let content = serde_json::to_string_pretty(projects)
            .map_err(|e| format!("Failed to serialize history: {}", e))?;
        
        fs::write(&history_file, content)
            .map_err(|e| format!("Failed to write history file: {}", e))?;
        
        info!("Saved {} projects to history", projects.len());
        Ok(())
    }
    
    /// Add a project to history
    pub fn add_to_history(path: &str) -> Result<(), String> {
        let mut projects = Self::load_history().unwrap_or_default();
        
        // Remove if already exists (so it goes to front)
        projects.retain(|p| p != path);
        
        // Add to front
        projects.insert(0, path.to_string());
        
        // Limit size
        if projects.len() > MAX_HISTORY_SIZE {
            projects.truncate(MAX_HISTORY_SIZE);
        }
        
        Self::save_history(&projects)
    }
    
    /// Remove a project from history
    pub fn remove_from_history(path: &str) -> Result<(), String> {
        let mut projects = Self::load_history().unwrap_or_default();
        projects.retain(|p| p != path);
        Self::save_history(&projects)
    }
    
    /// Clear all history
    pub fn clear_history() -> Result<(), String> {
        Self::save_history(&[])
    }
}
