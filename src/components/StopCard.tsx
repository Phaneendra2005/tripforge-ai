import { Clock, MapPin, Edit2, Trash2, ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import type { Stop } from "../types/trip";

interface StopCardProps {
  stop: Stop;
  index: number;
  totalStops: number;
  onEdit: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  culture: "bg-purple-100 text-purple-700",
  food: "bg-orange-100 text-orange-700",
  nature: "bg-green-100 text-green-700",
  activity: "bg-blue-100 text-blue-700",
  shopping: "bg-pink-100 text-pink-700",
  transport: "bg-slate-100 text-slate-700",
  relaxation: "bg-teal-100 text-teal-700",
};

export function StopCard({
  stop,
  index,
  totalStops,
  onEdit,
  onRemove,
  onMoveUp,
  onMoveDown,
  onRegenerate,
  isRegenerating,
}: StopCardProps) {
  return (
    <div className={`relative bg-white rounded-xl border border-slate-200 p-5 shadow-sm transition-all ${isRegenerating ? 'opacity-50 pointer-events-none' : 'hover:shadow-md'}`}>
      {isRegenerating && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 rounded-xl backdrop-blur-[1px]">
          <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
        </div>
      )}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 text-slate-700 font-semibold text-sm px-3 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {stop.time}
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${CATEGORY_COLORS[stop.category] || "bg-slate-100 text-slate-700"}`}>
            {stop.category}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button onClick={onMoveUp} disabled={index === 0} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md disabled:opacity-30" title="Move Up">
            <ArrowUp className="w-4 h-4" />
          </button>
          <button onClick={onMoveDown} disabled={index === totalStops - 1} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md disabled:opacity-30" title="Move Down">
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 mb-2">{stop.title}</h3>
      <p className="text-slate-600 text-sm mb-4 leading-relaxed">{stop.description}</p>
      
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
          <MapPin className="w-4 h-4" />
          {stop.durationMinutes} min
        </div>
        <div className="flex items-center gap-1 text-sm text-slate-500 font-medium">
          <span className="font-sans">₹</span>
          {stop.estimatedCost}
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <button onClick={onRegenerate} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium" title="Replace with AI">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">AI Replace</span>
          </button>
          <button onClick={onEdit} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={onRemove} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
