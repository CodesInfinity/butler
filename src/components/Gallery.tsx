import { PhotoFile } from "../types";

interface GalleryProps {
  files: PhotoFile[];
  onBack: () => void;
}

export default function Gallery({ files, onBack }: GalleryProps) {
  // Función para formatear tamaño
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Función para formatear fecha
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 min-h-screen">
      {/* Header Fijo */}
      <div className="bg-white px-6 py-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          >
            ← Volver
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Galería del iPhone</h2>
            <p className="text-xs text-slate-500">{files.length} archivos encontrados</p>
          </div>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">
          Importar Todo
        </button>
      </div>

      {/* Grid de Archivos */}
      <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-y-auto">
        {files.map((file) => (
          <div 
            key={file.id} 
            className="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all cursor-pointer relative"
          >
            {/* Placeholder Visual (Icono) */}
            <div className="aspect-square bg-slate-100 flex items-center justify-center text-4xl text-slate-300 group-hover:scale-105 transition-transform duration-300">
              {file.type.includes("movie") ? "🎬" : "🖼️"}
            </div>
            
            {/* Info del archivo */}
            <div className="p-3">
              <p className="text-sm font-medium text-slate-700 truncate" title={file.name}>
                {file.name}
              </p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-slate-400">{formatSize(file.size)}</span>
                <span className="text-xs text-slate-300">{formatDate(file.date)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}