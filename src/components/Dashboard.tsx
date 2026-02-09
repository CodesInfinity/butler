import { useState } from "react";
import { DeviceData } from "../types";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
import FileGrid from "./FileGrid";
import DashboardFooter from "./DashboardFooter";

interface DashboardProps {
  deviceData: DeviceData;
}

export default function Dashboard({ deviceData }: DashboardProps) {
  const [activeCategory, setActiveCategory] = useState("photos");
  
  // Calcular tamaño de nuevos archivos (simulado: 10% del espacio usado)
  const newFilesSize = deviceData.storage.used_space * 0.1;

  const handleImport = () => {
    // TODO: Implementar lógica de importación
    console.log("Importando archivos...");
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900">
      <DashboardHeader
        deviceName={deviceData.device_name}
        storage={deviceData.storage}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        <main className="flex-1 overflow-y-auto">
          <FileGrid files={deviceData.files} category={activeCategory} />
        </main>
      </div>

      <DashboardFooter newFilesSize={newFilesSize} onImport={handleImport} />
    </div>
  );
}
