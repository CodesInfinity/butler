// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_shell::ShellExt;

// --- ESTRUCTURAS DE DATOS ---

#[derive(serde::Serialize)]
struct DeviceResponse {
    connected: bool,
    device_id: Option<String>,
    name: Option<String>,
    storage_total: Option<u64>,
    storage_free: Option<u64>,
    message: String,
}

// CORRECCIÓN: Añadido serde::Deserialize aquí 👇
#[derive(serde::Serialize, serde::Deserialize)]
struct GalleryResponse {
    success: bool,
    files: Option<Vec<PhotoFile>>,
    error: Option<String>,
}

#[derive(serde::Serialize, serde::Deserialize, Debug)]
struct PhotoFile {
    name: String,
    size: u64,
    #[serde(rename = "type")] // Mapeamos "type" del JSON a "file_type" en Rust
    file_type: String, 
    date: f64,
    id: u64,
}

// --- COMANDOS ---

#[tauri::command]
async fn detect_ios_device(app: tauri::AppHandle) -> Result<DeviceResponse, String> {
    // 1. Detectar ID
    let cmd_id = app.shell().sidecar("ideviceinfo").map_err(|e| e.to_string())?.args(["-k", "UniqueDeviceID"]);
    let output_id = cmd_id.output().await.map_err(|e| e.to_string())?;
    let id_str = String::from_utf8_lossy(&output_id.stdout).trim().to_string();

    if id_str.is_empty() {
        return Ok(DeviceResponse {
            connected: false,
            device_id: None,
            name: None,
            storage_total: None,
            storage_free: None,
            message: "Desconectado".to_string(),
        });
    }

    // 2. Obtener Nombre
    let cmd_name = app.shell().sidecar("ideviceinfo").map_err(|e| e.to_string())?.args(["-k", "DeviceName"]);
    let output_name = cmd_name.output().await.map_err(|e| e.to_string())?;
    let device_name = String::from_utf8_lossy(&output_name.stdout).trim().to_string();

    // 3. Obtener TotalDiskCapacity
    let cmd_total = app.shell().sidecar("ideviceinfo").map_err(|e| e.to_string())?.args(["-k", "TotalDiskCapacity"]);
    let output_total = cmd_total.output().await.map_err(|e| e.to_string())?;
    let total_str = String::from_utf8_lossy(&output_total.stdout).trim().to_string();
    let total = total_str.parse::<u64>().ok();

    // 4. Obtener TotalDataAvailable
    let cmd_free = app.shell().sidecar("ideviceinfo").map_err(|e| e.to_string())?.args(["-k", "TotalDataAvailable"]);
    let output_free = cmd_free.output().await.map_err(|e| e.to_string())?;
    let free_str = String::from_utf8_lossy(&output_free.stdout).trim().to_string();
    let free = free_str.parse::<u64>().ok();

    Ok(DeviceResponse {
        connected: true,
        device_id: Some(id_str),
        name: Some(device_name),
        storage_total: total,
        storage_free: free,
        message: "Conectado".to_string(),
    })
}

#[tauri::command]
async fn get_device_photos(app: tauri::AppHandle) -> Result<GalleryResponse, String> {
    println!("Iniciando escaneo de fotos...");
    
    // Ejecutamos el binario Swift
    let cmd = app.shell().sidecar("butler-gallery").map_err(|e| e.to_string())?;
    let output = cmd.output().await.map_err(|e| e.to_string())?;
    
    let stdout = String::from_utf8_lossy(&output.stdout);
    
    // Convertimos el JSON de Swift a Structs de Rust
    // Ahora funcionará porque GalleryResponse implementa Deserialize
    let response: GalleryResponse = match serde_json::from_str(&stdout) {
        Ok(res) => res,
        Err(e) => {
            println!("Error parseando JSON: {}", e);
            GalleryResponse {
                success: false,
                files: None,
                error: Some(format!("Error leyendo datos: {}", e)),
            }
        }
    };

    Ok(response)
}

// --- MAIN ---

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![detect_ios_device, get_device_photos])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}