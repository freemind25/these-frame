#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;

#[tauri::command]
fn get_app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[tauri::command]
fn get_app_data_dir(app_handle: tauri::AppHandle) -> Result<String, String> {
    app_handle
        .path()
        .app_data_dir()
        .map(|p| p.to_string_lossy().to_string())
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn get_documents_dir() -> Result<String, String> {
    dirs::documents_dir()
        .map(|p| p.to_string_lossy().to_string())
        .ok_or_else(|| "Could not determine documents directory".to_string())
}

#[tauri::command]
fn get_desktop_dir() -> Result<String, String> {
    dirs::desktop_dir()
        .map(|p| p.to_string_lossy().to_string())
        .ok_or_else(|| "Could not determine desktop directory".to_string())
}

#[tauri::command]
fn is_desktop() -> bool {
    true
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_app_version,
            get_app_data_dir,
            get_documents_dir,
            get_desktop_dir,
            is_desktop
        ])
        .run(tauri::generate_context!())
        .expect("error while running ThesisFrame");
}
