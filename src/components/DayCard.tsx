import { useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import type { Day } from "../types/trip";
import { StopCard } from "./StopCard";

interface DayCardProps {
  day: Day;
  onEditStop: (stopId: string) => void;
  onRemoveStop: (stopId: string) => void;
  onMoveStop: (stopId: string, direction: "up" | "down") => void;
  onAddStop: () => void;
  onRegenerateStop: (stopId: string) => void;
  regeneratingStopId: string | null;
}

export function DayCard({
  day,
  onEditStop,
  onRemoveStop,
  onMoveStop,
  onAddStop,
  onRegenerateStop,
  regeneratingStopId,
}: DayCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-6 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div 
        className="p-5 md:p-6 bg-slate-50 border-b border-slate-200 cursor-pointer flex items-center justify-between hover:bg-slate-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
              Day {day.day}
            </span>
            <h2 className="text-xl font-bold text-slate-800">{day.title}</h2>
          </div>
          <p className="text-slate-600 text-sm">{day.summary}</p>
        </div>
        <div className="text-slate-400">
          {isExpanded ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-5 md:p-6 bg-slate-50/50">
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {day.stops.map((stop, index) => (
              <div key={stop.id} className="relative z-10">
                <StopCard
                  stop={stop}
                  index={index}
                  totalStops={day.stops.length}
                  onEdit={() => onEditStop(stop.id)}
                  onRemove={() => onRemoveStop(stop.id)}
                  onMoveUp={() => onMoveStop(stop.id, "up")}
                  onMoveDown={() => onMoveStop(stop.id, "down")}
                  onRegenerate={() => onRegenerateStop(stop.id)}
                  isRegenerating={regeneratingStopId === stop.id}
                />
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={onAddStop}
              className="bg-white border-2 border-dashed border-slate-300 text-slate-600 hover:border-emerald-500 hover:text-emerald-600 rounded-xl py-3 px-6 font-medium text-sm flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              Add Stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
