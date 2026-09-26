import { Compass } from "lucide-react";

interface HeaderProps {
  onNewTrip: () => void;
}

export function Header({ onNewTrip }: HeaderProps) {
  return (
    <header className="fixed top-0 inset-x-0 z-30 bg-white border-b border-slate-200 h-16">
      <div className="max-w-4xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary cursor-pointer" onClick={onNewTrip}>
          <Compass className="w-6 h-6 text-emerald-600" />
          <span className="font-bold text-xl tracking-tight">TripForge AI</span>
        </div>
        <div className="hidden sm:block text-sm text-slate-500 mr-auto ml-6">
          Turn a travel idea into an itinerary you can actually edit.
        </div>
        <button
          onClick={onNewTrip}
          className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
        >
          New Trip
        </button>
      </div>
    </header>
  );
}
