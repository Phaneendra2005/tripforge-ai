interface ExamplePromptsProps {
  onSelect: (prompt: string) => void;
}

const EXAMPLES = [
  {
    label: "Tokyo · 5 days · food + culture",
    prompt: "I'm visiting Tokyo for 5 days with my family. We love food, culture and relaxed sightseeing. Keep it moderate budget."
  },
  {
    label: "Goa · 3 days · beaches + relaxed travel",
    prompt: "I want to go to Goa for 3 days. Focus on nice beaches, relaxed travel, and good seafood."
  },
  {
    label: "Delhi · 2 days · history + street food",
    prompt: "Visiting Delhi for 2 days. Want a packed itinerary with history, monuments, and authentic street food."
  }
];

export function ExamplePrompts({ onSelect }: ExamplePromptsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-8">
      {EXAMPLES.map((ex, i) => (
        <button
          key={i}
          onClick={() => onSelect(ex.prompt)}
          className="bg-white border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-full text-sm font-medium transition-colors"
        >
          {ex.label}
        </button>
      ))}
    </div>
  );
}
