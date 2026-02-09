// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::process::Command;
use serde::{Deserialize, Serialize};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Ejecuta un comando del sistema y devuelve su salida
/// Ejemplo de uso para ADB u otros comandos externos
#[tauri::command]
async fn execute_command(command: String, args: Vec<String>) -> Result<String, String> {
    let output = Command::new(&command)
        .args(&args)
        .output()
        .map_err(|e| format!("Error ejecutando comando: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

/// Ejemplo específico para verificar si ADB está disponible
#[tauri::command]
async fn check_adb() -> Result<String, String> {
    let output = Command::new("adb")
        .arg("version")
        .output()
        .map_err(|e| format!("ADB no encontrado: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err("ADB no está instalado o no está en el PATH".to_string())
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MobileFile {
    pub id: String,
    pub name: String,
    pub size_mb: f64,
    #[serde(rename = "type")]
    pub file_type: String, // "image" o "video"
    pub preview_url: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DeviceStorage {
    pub total_space: f64, // en GB
    pub used_space: f64,  // en GB
    pub photos_count: u32,
    pub videos_count: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DeviceData {
    pub device_name: String,
    pub storage: DeviceStorage,
    pub files: Vec<MobileFile>,
}

/// Simula la obtención de datos del dispositivo móvil
/// Incluye un delay de 2 segundos para simular el proceso de conexión
#[tauri::command]
async fn get_device_data() -> Result<DeviceData, String> {
    // Simular delay de 2 segundos
    tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;

    // Datos simulados de un iPhone 14 con 128GB
    let storage = DeviceStorage {
        total_space: 128.0,
        used_space: 64.0, // 50% usado
        photos_count: 1250,
        videos_count: 45,
    };

    // Generar 10 archivos ficticios
    let mut files = Vec::new();
    let file_names = vec![
        "IMG_2024_01_15.jpg",
        "IMG_2024_01_20.jpg",
        "VID_2024_02_01.mp4",
        "IMG_2024_02_10.jpg",
        "IMG_2024_02_15.jpg",
        "VID_2024_02_20.mp4",
        "IMG_2024_03_01.jpg",
        "IMG_2024_03_05.jpg",
        "VID_2024_03_10.mp4",
        "IMG_2024_03_15.jpg",
    ];

    for (index, name) in file_names.iter().enumerate() {
        let is_video = name.contains("VID");
        let file_type = if is_video { "video" } else { "image" };
        
        files.push(MobileFile {
            id: format!("file_{}", index + 1),
            name: name.to_string(),
            size_mb: if is_video { 45.2 + (index as f64 * 2.3) } else { 2.5 + (index as f64 * 0.3) },
            file_type: file_type.to_string(),
            preview_url: format!("https://picsum.photos/400/400?random={}", index + 1),
        });
    }

    Ok(DeviceData {
        device_name: "iPhone 14".to_string(),
        storage,
        files,
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, execute_command, check_adb, get_device_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
