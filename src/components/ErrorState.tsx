import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry: () => void;
}

export function ErrorState({ 
  title = "Something went wrong", 
  message, 
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="w-full max-w-2xl mx-auto py-16 flex flex-col items-center justify-center text-center">
      <div className="bg-red-50 p-4 rounded-full mb-6">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-md mb-8">{message}</p>
      <button
        onClick={onRetry}
        className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm"
      >
        Try Again
      </button>
    </div>
  );
}
