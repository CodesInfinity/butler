import { MobileFile } from "../types";

interface FileGridProps {
  files: MobileFile[];
  category: string;
}

export default function FileGrid({ files, category }: FileGridProps) {
  // Filtrar archivos según la categoría activa
  const filteredFiles =
    category === "photos"
      ? files.filter((f) => f.type === "image")
      : category === "videos"
      ? files.filter((f) => f.type === "video")
      : files;

  if (filteredFiles.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
        <p>No hay archivos en esta categoría</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-6">
      {filteredFiles.map((file) => (
        <div
          key={file.id}
          className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          {file.type === "image" ? (
            <img
              src={file.preview_url}
              alt={file.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-600">
              <svg
                className="w-12 h-12 text-slate-400 dark:text-slate-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
          )}

          {/* Overlay con información al hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2">
            <p className="text-white text-xs font-medium truncate">{file.name}</p>
            <p className="text-white/80 text-xs">{file.size_mb.toFixed(1)} MB</p>
          </div>

          {/* Badge de tipo */}
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 text-xs font-medium rounded bg-black/50 text-white">
              {file.type === "image" ? "IMG" : "VID"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
