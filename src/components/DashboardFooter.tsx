interface DashboardFooterProps {
  newFilesSize: number; // en GB
  onImport: () => void;
}

export default function DashboardFooter({ newFilesSize, onImport }: DashboardFooterProps) {
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium text-slate-900 dark:text-slate-50">
            {newFilesSize.toFixed(1)} GB
          </span>{" "}
          de nuevos archivos disponibles para importar
        </div>
        <button
          onClick={onImport}
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
        >
          Importar Nuevos ({newFilesSize.toFixed(1)} GB)
        </button>
      </div>
    </footer>
  );
}
