import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { DeviceResponse, GalleryResponse, PhotoFile } from "./types";
import Gallery from "./components/Gallery";
import "./App.css";

function App() {
  const [deviceData, setDeviceData] = useState<DeviceResponse | null>(null);
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [view, setView] = useState<"dashboard" | "gallery">("dashboard");
  
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Esperando dispositivo...");

  const formatBytesToGB = (bytes: number) => (bytes / (1024 ** 3)).toFixed(1);

  // 1. Detectar Dispositivo
  async function checkDevice() {
    setIsLoading(true);
    setStatusMessage("Buscando iPhone...");
    try {
      const response = await invoke<DeviceResponse>("detect_ios_device");
      setStatusMessage(response.message);
      setDeviceData(response.connected ? response : null);
    } catch (error) {
      console.error(error);
      setStatusMessage(`Error: ${error}`);
      setDeviceData(null);
    } finally {
      setIsLoading(false);
    }
  }

  // 2. Cargar Fotos
  async function loadPhotos() {
    setIsLoading(true);
    setStatusMessage("Leyendo galería (esto puede tardar)...");
    try {
      const response = await invoke<GalleryResponse>("get_device_photos");
      if (response.success && response.files) {
        setPhotos(response.files);
        setView("gallery");
      } else {
        alert("Error cargando fotos: " + response.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error crítico al leer galería");
    } finally {
      setIsLoading(false);
    }
  }

  // Si estamos en modo galería, mostramos el componente
  if (view === "gallery") {
    return <Gallery files={photos} onBack={() => setView("dashboard")} />;
  }

  // DASHBOARD PRINCIPAL
  const usedStorage = (deviceData?.storage_total && deviceData?.storage_free)
    ? deviceData.storage_total - deviceData.storage_free : 0;
  const percentage = deviceData?.storage_total 
    ? (usedStorage / deviceData.storage_total) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800 font-sans p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-indigo-600 tracking-tight">Butler</h1>
          <p className="text-slate-400 text-sm">iOS Manager</p>
        </div>

        {/* Estado Conexión */}
        <div className="mb-8 flex justify-center">
          {deviceData?.connected ? (
            <div className="relative">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-4xl shadow-inner">📱</div>
              <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
            </div>
          ) : (
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-4xl animate-pulse">🔌</div>
          )}
        </div>

        {/* Info Dispositivo */}
        {deviceData?.connected ? (
          <div className="mb-8 text-left bg-slate-50 p-5 rounded-xl border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-1">{deviceData.name || "iPhone Conectado"}</h2>
            <p className="text-xs text-slate-400 font-mono mb-4">ID: {deviceData.device_id}</p>

            {/* Barra de Almacenamiento Resiliente */}
            {deviceData.storage_total ? (
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                  <span>{formatBytesToGB(usedStorage)} GB</span>
                  <span>{formatBytesToGB(deviceData.storage_total)} GB</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            ) : (
              <div className="bg-indigo-50 text-indigo-700 p-3 rounded-lg flex items-center gap-3 text-sm font-medium">
                <span className="flex h-3 w-3 relative"><span className="animate-ping absolute h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span></span>
                Listo para explorar
              </div>
            )}
            
            {/* BOTÓN PARA VER FOTOS */}
            <button 
              onClick={loadPhotos}
              disabled={isLoading}
              className="mt-6 w-full py-3 bg-indigo-100 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-200 transition-colors flex justify-center items-center gap-2"
            >
               {isLoading ? "Leyendo..." : "📂 Ver Galería de Fotos"}
            </button>
          </div>
        ) : (
          <div className="mb-8">
            <p className="text-lg font-medium text-slate-600">No hay dispositivo</p>
            <p className="text-sm text-slate-400 mt-1">{statusMessage}</p>
          </div>
        )}

        {/* Botón Principal */}
        {!deviceData?.connected && (
          <button
            onClick={checkDevice}
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-lg transition-all"
          >
            {isLoading ? "Escaneando..." : "Detectar Dispositivo"}
          </button>
        )}
      </div>
    </div>
  );
}

export default App;