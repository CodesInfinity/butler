interface SidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "photos", label: "Fotos", icon: "📷" },
  { id: "videos", label: "Vídeos", icon: "🎥" },
  { id: "whatsapp", label: "WhatsApp", icon: "💬" },
  { id: "cleanup", label: "Limpieza", icon: "🧹" },
];

export default function Sidebar({ activeCategory, onCategoryChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-4">
      <nav className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
              activeCategory === category.id
                ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-medium"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            }`}
          >
            <span className="text-xl">{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
