import { Sparkles } from "lucide-react";

interface PromptInputProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function PromptInput({ prompt, setPrompt, onSubmit, isLoading }: PromptInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      onSubmit();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
        <div className="relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="I'm visiting Tokyo for 5 days with my family. We love food, culture and relaxed sightseeing..."
            className="w-full min-h-[120px] p-5 bg-transparent resize-none focus:outline-none text-slate-700 placeholder:text-slate-400"
            disabled={isLoading}
          />
          <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-400 hidden sm:inline-block">
              Press Cmd/Ctrl + Enter to submit
            </span>
            <button
              onClick={onSubmit}
              disabled={isLoading || !prompt.trim()}
              className="ml-auto bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              Build My Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
