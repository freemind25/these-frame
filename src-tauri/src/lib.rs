#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Child;
use std::sync::Mutex;
use tauri::Manager;

/// Handle to the embedded Next.js server process, kept alive for the app's lifetime.
struct ServerProcess(Mutex<Option<Child>>);

/// Spawns the bundled Node.js runtime with the standalone Next.js server if the
/// packaged resources are present (production build). In `tauri dev`, the resources
/// don't exist and the app relies on `devUrl` pointing at the Next.js dev server instead.
fn spawn_embedded_server(app: &tauri::App) {
    let resource_dir = match app.path().resource_dir() {
        Ok(dir) => dir,
        Err(e) => {
            eprintln!("Could not resolve resource dir: {e}");
            return;
        }
    };

    let node_exe = resource_dir.join("resources").join("node").join("node.exe");
    let start_js = resource_dir.join("resources").join("app").join("start.js");

    if !node_exe.exists() || !start_js.exists() {
        // Dev mode or resources missing: nothing to spawn.
        return;
    }

    let mut command = std::process::Command::new(&node_exe);
    command.arg(&start_js);

    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        const CREATE_NO_WINDOW: u32 = 0x08000000;
        command.creation_flags(CREATE_NO_WINDOW);
    }

    match command.spawn() {
        Ok(child) => {
            let state = app.state::<ServerProcess>();
            *state.0.lock().unwrap() = Some(child);
        }
        Err(e) => eprintln!("Failed to start ThesisFrame server: {e}"),
    }
}

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
    dirs::document_dir()
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
        .manage(ServerProcess(Mutex::new(None)))
        .invoke_handler(tauri::generate_handler![
            get_app_version,
            get_app_data_dir,
            get_documents_dir,
            get_desktop_dir,
            is_desktop
        ])
        .setup(|app| {
            spawn_embedded_server(app);
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                let state = window.app_handle().state::<ServerProcess>();
                if let Some(mut child) = state.0.lock().unwrap().take() {
                    let _ = child.kill();
                };
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running ThesisFrame");
}
