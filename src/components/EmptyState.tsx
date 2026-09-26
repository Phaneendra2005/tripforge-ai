export function EmptyState() {
  return (
    <div className="w-full max-w-2xl mx-auto py-16 flex flex-col items-center justify-center text-center px-4">
      <div className="mb-8 p-4 bg-emerald-50 rounded-full">
        <svg className="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-slate-800 mb-4">Plan less. Explore more.</h2>
      <p className="text-slate-600 max-w-md mx-auto text-lg">
        Describe your destination, dates, interests, travel style, and budget. TripForge turns it into a structured itinerary you can edit.
      </p>
    </div>
  );
}
