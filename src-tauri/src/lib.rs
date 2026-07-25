use serde::{Deserialize, Serialize};
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;
use std::time::Duration;
use tauri::Manager;
#[cfg(windows)]
use std::os::windows::process::CommandExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            get_app_version,
            get_documents_dir,
            get_desktop_dir,
            is_desktop,
            get_server_status,
        ])
        .setup(|app| {
            // Start the embedded Next.js server
            spawn_server(app.handle().clone());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running ThesisFrame");
}

struct ServerChild(Mutex<Option<Child>>);

fn spawn_server(app: tauri::AppHandle) {
    // Spawn in a background thread so we don't block setup
    std::thread::spawn(move || {
        let resource_dir = app
            .path()
            .resource_dir()
            .expect("failed to resolve resource dir");

        // In dev mode, the server is started by `beforeDevCommand`.
        // In production, we start the standalone server ourselves.
        #[cfg(not(debug_assertions))]
        {
            let server_dir = resource_dir.join("server");
            let node_exe = server_dir.join("node.exe");
            let server_js = server_dir.join("server.js");

            // Ensure db directory exists
            let db_dir = server_dir.join("db");
            std::fs::create_dir_all(&db_dir).ok();

            if !node_exe.exists() {
                eprintln!("[ThesisFrame] node.exe not found at {:?}", node_exe);
                return;
            }
            if !server_js.exists() {
                eprintln!("[ThesisFrame] server.js not found at {:?}", server_js);
                return;
            }

            eprintln!("[ThesisFrame] Starting Next.js server...");

            let child = Command::new(&node_exe)
                .arg(&server_js)
                .env("PORT", "3100")
                .env("HOSTNAME", "127.0.0.1")
                .env("NODE_ENV", "production")
                .env("DATABASE_URL", format!("file:{}/custom.db", db_dir.display()))
                .current_dir(&server_dir)
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .creation_flags(0x08000000) // CREATE_NO_WINDOW on Windows
                .spawn();

            match child {
                Ok(c) => {
                    // Store the child process handle
                    if let Some(state) = app.try_state::<ServerChild>() {
                        *state.0.lock().unwrap() = Some(c);
                    }
                    // Wait for server to be ready
                    wait_for_server("127.0.0.1:3100", 60);
                }
                Err(e) => {
                    eprintln!("[ThesisFrame] Failed to start server: {}", e);
                }
            }
        }

        #[cfg(debug_assertions)]
        {
            wait_for_server("127.0.0.1:3000", 30);
        }
    });
}

fn wait_for_server(addr: &str, timeout_secs: u64) {
    let client = reqwest::blocking::Client::builder()
        .timeout(Duration::from_secs(2))
        .build()
        .ok();

    if let Some(client) = client {
        for i in 0..timeout_secs {
            if let Ok(resp) = client.get(format!("http://{}/", addr)).send() {
                if resp.status().is_success() {
                    eprintln!("[ThesisFrame] Server ready after {}s", i);
                    return;
                }
            }
            std::thread::sleep(Duration::from_secs(1));
        }
        eprintln!("[ThesisFrame] WARNING: Server not ready after {}s", timeout_secs);
    }
}

#[derive(Serialize, Deserialize)]
struct ServerStatus {
    running: bool,
}

#[tauri::command]
fn get_app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[tauri::command]
fn is_desktop() -> bool {
    true
}

#[tauri::command]
fn get_documents_dir() -> Result<String, String> {
    dirs::document_dir()
        .or_else(dirs::home_dir)
        .map(|p| p.to_string_lossy().to_string())
        .ok_or_else(|| "Cannot determine documents directory".to_string())
}

#[tauri::command]
fn get_desktop_dir() -> Result<String, String> {
    dirs::desktop_dir()
        .or_else(dirs::home_dir)
        .map(|p| p.to_string_lossy().to_string())
        .ok_or_else(|| "Cannot determine desktop directory".to_string())
}

#[tauri::command]
fn get_server_status() -> ServerStatus {
    let client = reqwest::blocking::Client::builder()
        .timeout(Duration::from_secs(2))
        .build();

    match client {
        Ok(c) => {
            let port = if cfg!(debug_assertions) { 3000 } else { 3100 };
            match c.get(format!("http://127.0.0.1:{}/", port)).send() {
                Ok(resp) => ServerStatus {
                    running: resp.status().is_success(),
                },
                Err(_) => ServerStatus { running: false },
            }
        }
        Err(_) => ServerStatus { running: false },
    }
}
