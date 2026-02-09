import { DeviceStorage } from "../types";

interface DashboardHeaderProps {
  deviceName: string;
  storage: DeviceStorage;
}

export default function DashboardHeader({ deviceName, storage }: DashboardHeaderProps) {
  const usedPercentage = (storage.used_space / storage.total_space) * 100;
  const freeSpace = storage.total_space - storage.used_space;

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            {deviceName}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {storage.photos_count} fotos • {storage.videos_count} vídeos
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Barra de progreso */}
          <div className="flex items-center gap-3">
            <div className="w-48">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>{usedPercentage.toFixed(1)}% usado</span>
                <span>{freeSpace.toFixed(1)} GB libres</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${usedPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
