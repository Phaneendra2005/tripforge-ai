import type { Trip } from "../types/trip";

interface TripHeaderProps {
  trip: Trip["trip"];
  calculatedTotal: number;
}

export function TripHeader({ trip, calculatedTotal }: TripHeaderProps) {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 mb-8 mt-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60"></div>
      
      <div className="relative z-10">
        <div className="uppercase tracking-wider text-emerald-600 font-bold text-sm mb-2 flex items-center gap-2">
          {trip.destination}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          {trip.title}
        </h1>
        <p className="text-slate-600 text-lg mb-6 max-w-2xl">
          {trip.summary}
        </p>
        
        <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Duration</span>
            <span className="font-medium text-slate-800">{trip.durationDays} Days</span>
          </div>
          <div className="w-px h-10 bg-slate-200 hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Travel Style</span>
            <span className="font-medium text-slate-800 capitalize">{trip.travelStyle}</span>
          </div>
          <div className="w-px h-10 bg-slate-200 hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Est. Budget</span>
            <span className="font-medium text-slate-800">
              {trip.budget.currency} {calculatedTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
