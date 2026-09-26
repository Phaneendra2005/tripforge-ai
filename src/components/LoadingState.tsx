import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="w-full max-w-2xl mx-auto py-24 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-emerald-100 rounded-full blur-xl animate-pulse"></div>
        <div className="relative bg-white p-4 rounded-full shadow-sm border border-emerald-100">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">
        Building your itinerary
      </h3>
      <p className="text-slate-500 max-w-sm">
        Analyzing your travel preferences and organizing your days...
      </p>
    </div>
  );
}
