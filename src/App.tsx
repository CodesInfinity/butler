import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { DeviceData } from "./types";
import WaitingScreen from "./components/WaitingScreen";
import Dashboard from "./components/Dashboard";

type AppState = "disconnected" | "loading" | "connected" | "error";

function App() {
  const [state, setState] = useState<AppState>("disconnected");
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimulateConnection = async () => {
    setState("loading");
    setError(null);

    try {
      const data = await invoke<DeviceData>("get_device_data");
      setDeviceData(data);
      setState("connected");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido al conectar el dispositivo");
      setState("error");
    }
  };

  // Renderizar según el estado
  if (state === "disconnected") {
    return (
      <WaitingScreen
        onSimulateConnection={handleSimulateConnection}
        isLoading={false}
      />
    );
  }

  if (state === "loading") {
    return (
      <WaitingScreen
        onSimulateConnection={handleSimulateConnection}
        isLoading={true}
      />
    );
  }

  if (state === "error") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <svg
              className="w-16 h-16 text-red-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-3">
            Error de conexión
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => {
              setState("disconnected");
              setError(null);
            }}
            className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-50 font-medium rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (state === "connected" && deviceData) {
    return <Dashboard deviceData={deviceData} />;
  }

  return null;
}

export default App;
