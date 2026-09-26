import { useState, useRef, useMemo, useEffect } from "react";
import { Header } from "./components/Header";
import { PromptInput } from "./components/PromptInput";
import { EmptyState } from "./components/EmptyState";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { ExamplePrompts } from "./components/ExamplePrompts";
import { TripHeader } from "./components/TripHeader";
import { DayCard } from "./components/DayCard";
import { StopEditor } from "./components/StopEditor";
import { AddStopModal } from "./components/AddStopModal";
import { JsonPreview } from "./components/JsonPreview";
import { AiReplaceModal } from "./components/AiReplaceModal";
import { generateTripRequest, regenerateStopRequest } from "./lib/api";
import { calculateTotalCost } from "./lib/tripUtils";
import { saveTrip, loadTrip, clearTrip } from "./lib/storage";
import type { Trip, Stop, Day } from "./types/trip";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorInfo, setErrorInfo] = useState<{title?: string, message: string} | null>(null);
  
  const [tripData, setTripData] = useState<Trip | null>(null);
  const [editingStopId, setEditingStopId] = useState<string | null>(null);
  const [addStopDayId, setAddStopDayId] = useState<number | null>(null);
  const [regeneratingStopId, setRegeneratingStopId] = useState<string | null>(null);
  const [aiReplaceStopId, setAiReplaceStopId] = useState<string | null>(null);
  const [aiReplaceError, setAiReplaceError] = useState<string | null>(null);

  const requestRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize routing and storage
  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    if (window.location.pathname === "/trip") {
      const storedTrip = loadTrip();
      if (storedTrip) {
        setTripData(storedTrip);
        setStatus("success");
      } else {
        // No valid trip found, fallback to home
        navigate("/");
      }
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Save trip whenever it changes and we are in success state
  useEffect(() => {
    if (tripData && status === "success") {
      saveTrip(tripData);
    }
  }, [tripData, status]);

  const navigate = (path: string) => {
    window.history.pushState(null, "", path);
    setCurrentPath(path);
  };

  const cancelPendingRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    cancelPendingRequest();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const currentReqId = ++requestRef.current;
    
    setStatus("loading");
    setErrorInfo(null);

    const res = await generateTripRequest(prompt, abortController.signal);

    if (abortController.signal.aborted || currentReqId !== requestRef.current) {
      return;
    }

    if (!res.success || !res.data) {
      setStatus("error");
      setErrorInfo({
        title: res.error?.code === "INVALID_SCHEMA" ? "AI returned an invalid response" : "Generation Failed",
        message: res.error?.message || "Failed to generate your trip."
      });
      return;
    }

    setTripData(res.data);
    setStatus("success");
    saveTrip(res.data);
    navigate("/trip");
  };

  const handleNewTrip = () => {
    cancelPendingRequest();
    setTripData(null);
    clearTrip();
    setPrompt("");
    setStatus("idle");
    setErrorInfo(null);
    navigate("/");
  };

  const handleSaveStop = (updatedStop: Stop) => {
    if (!tripData) return;
    const newDays = tripData.days.map(day => ({
      ...day,
      stops: day.stops.map(stop => (stop.id === updatedStop.id ? updatedStop : stop))
    }));
    setTripData({ ...tripData, days: newDays });
    setEditingStopId(null);
  };

  const handleRemoveStop = (stopId: string) => {
    if (!tripData) return;
    const newDays = tripData.days.map(day => ({
      ...day,
      stops: day.stops.filter(stop => stop.id !== stopId)
    }));
    setTripData({ ...tripData, days: newDays });
  };

  const handleMoveStop = (stopId: string, direction: "up" | "down") => {
    if (!tripData) return;
    const newDays = tripData.days.map(day => {
      const stops = [...day.stops];
      const index = stops.findIndex(s => s.id === stopId);
      if (index === -1) return day;

      if (direction === "up" && index > 0) {
        [stops[index - 1], stops[index]] = [stops[index], stops[index - 1]];
      } else if (direction === "down" && index < stops.length - 1) {
        [stops[index], stops[index + 1]] = [stops[index + 1], stops[index]];
      }
      return { ...day, stops };
    });
    setTripData({ ...tripData, days: newDays });
  };

  const handleAddStopSubmit = (stop: Stop) => {
    if (!tripData || addStopDayId === null) return;
    const newDays = tripData.days.map(day => {
      if (day.day === addStopDayId) {
        return { ...day, stops: [...day.stops, stop] };
      }
      return day;
    });
    setTripData({ ...tripData, days: newDays });
    setAddStopDayId(null);
  };

  const confirmRegenerateStop = async (instruction: string) => {
    const stopId = aiReplaceStopId;
    if (!tripData || !stopId) return;

    setAiReplaceError(null);
    setRegeneratingStopId(stopId);

    let targetDay: Day | null = null;
    let targetStop: Stop | null = null;

    for (const day of tripData.days) {
      const stop = day.stops.find(s => s.id === stopId);
      if (stop) {
        targetDay = day;
        targetStop = stop;
        break;
      }
    }

    if (!targetDay || !targetStop) {
      setRegeneratingStopId(null);
      return;
    }

    const res = await regenerateStopRequest(tripData, targetDay, targetStop, instruction);
    
    if (res.success && res.data) {
      const newDays = tripData.days.map(day => {
        if (day.day === targetDay!.day) {
          return {
            ...day,
            stops: day.stops.map(s => (s.id === stopId ? res.data!.stop : s))
          };
        }
        return day;
      });
      setTripData({ ...tripData, days: newDays });
      setAiReplaceStopId(null);
      setAiReplaceError(null);
    } else {
      setAiReplaceError(res.error?.message || "Network error occurred.");
    }

    setRegeneratingStopId(null);
  };

  const calculatedTotal = useMemo(() => {
    if (!tripData) return 0;
    return calculateTotalCost(tripData);
  }, [tripData]);

  const editingStopObj = useMemo(() => {
    if (!tripData || !editingStopId) return null;
    for (const day of tripData.days) {
      const stop = day.stops.find(s => s.id === editingStopId);
      if (stop) return stop;
    }
    return null;
  }, [tripData, editingStopId]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pt-16">
      <Header onNewTrip={handleNewTrip} />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
        {currentPath === "/" && status === "idle" && (
          <div className="animate-in fade-in duration-500">
            <EmptyState />
            <PromptInput 
              prompt={prompt} 
              setPrompt={setPrompt} 
              onSubmit={handleGenerate}
              isLoading={false}
            />
            <ExamplePrompts onSelect={(p) => setPrompt(p)} />
          </div>
        )}

        {currentPath === "/" && status === "loading" && <LoadingState />}

        {currentPath === "/" && status === "error" && errorInfo && (
          <ErrorState 
            title={errorInfo.title}
            message={errorInfo.message} 
            onRetry={handleGenerate} 
          />
        )}

        {currentPath === "/trip" && tripData && status === "success" && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <TripHeader trip={tripData.trip} calculatedTotal={calculatedTotal} />
            
            <div className="space-y-2">
              {tripData.days.map(day => (
                <DayCard
                  key={day.day}
                  day={day}
                  onEditStop={setEditingStopId}
                  onRemoveStop={handleRemoveStop}
                  onMoveStop={handleMoveStop}
                  onAddStop={() => setAddStopDayId(day.day)}
                  onRegenerateStop={setAiReplaceStopId}
                  regeneratingStopId={regeneratingStopId}
                />
              ))}
            </div>

            <JsonPreview data={tripData} />
          </div>
        )}
      </main>

      {editingStopObj && (
        <StopEditor 
          stop={editingStopObj} 
          onSave={handleSaveStop} 
          onCancel={() => setEditingStopId(null)} 
        />
      )}

      {addStopDayId !== null && (
        <AddStopModal 
          onSave={handleAddStopSubmit}
          onCancel={() => setAddStopDayId(null)}
        />
      )}

      {aiReplaceStopId !== null && (
        <AiReplaceModal 
          isOpen={true}
          isLoading={regeneratingStopId === aiReplaceStopId}
          error={aiReplaceError}
          onConfirm={confirmRegenerateStop}
          onCancel={() => {
            setAiReplaceStopId(null);
            setAiReplaceError(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
