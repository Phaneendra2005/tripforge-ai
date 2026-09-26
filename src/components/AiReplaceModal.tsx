import { useState } from "react";
import { X, Sparkles, AlertTriangle, Loader2 } from "lucide-react";
import { useBodyScrollLock } from "../lib/useBodyScrollLock";

interface AiReplaceModalProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  onConfirm: (instruction: string) => void;
  onCancel: () => void;
}

export function AiReplaceModal({ isOpen, isLoading, error, onConfirm, onCancel }: AiReplaceModalProps) {
  const [instruction, setInstruction] = useState("");

  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || isLoading) return;
    onConfirm(instruction);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-lg text-slate-800">AI Replace Stop</h3>
          </div>
          <button type="button" onClick={onCancel} disabled={isLoading} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50 rounded-lg" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
          {error && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 animate-in fade-in zoom-in-95 duration-200" role="alert" aria-live="assertive">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-rose-800">
                    {error.includes("format") || error.includes("invalid") ? "AI returned an invalid response" : "AI service is temporarily unavailable"}
                  </h4>
                  <p className="text-sm text-rose-600 mt-1">
                    {error.includes("format") || error.includes("invalid") 
                      ? "The AI response didn't match the format TripForge AI expects. Your trip is unchanged. Please try again."
                      : "We couldn't connect to the TripForge AI server. Please check that the backend is running and try again."}
                  </p>
                  <p className="text-xs text-rose-400 mt-2 font-mono bg-rose-100/50 px-2 py-1 rounded inline-block">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                How should this stop change?
              </label>
              <textarea 
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="e.g., 'Make it more family-friendly', 'Find a cheaper alternative'"
                rows={4} 
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none disabled:bg-slate-50 disabled:text-slate-500"
                autoFocus
                disabled={isLoading}
              ></textarea>
            </div>

            {isLoading && (
              <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl animate-in fade-in zoom-in-95 duration-300">
                <div className="p-1.5 bg-white rounded-lg shadow-sm border border-emerald-100 shrink-0">
                  <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-800">TripForge AI is working...</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Creating a better stop based on your request.</p>
                </div>
              </div>
            )}
          </div>
        </form>
        
        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button type="button" onClick={onCancel} disabled={isLoading} className="px-4 py-2 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-sm transition-colors">
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={!instruction.trim() || isLoading} 
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2 min-w-[100px] justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Thinking...
              </>
            ) : error ? (
              <>
                <Sparkles className="w-4 h-4" />
                Try Again
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
