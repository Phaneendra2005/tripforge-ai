import { StopEditor } from "./StopEditor";

import type { Stop } from "../types/trip";

interface AddStopModalProps {
  onSave: (stop: Stop) => void;
  onCancel: () => void;
}

export function AddStopModal({ onSave, onCancel }: AddStopModalProps) {
  const newStop: Stop = {
    id: `manual-${Date.now()}`,
    time: "",
    title: "",
    category: "activity",
    durationMinutes: 60,
    estimatedCost: 0,
    description: "",
  };

  return (
    <StopEditor
      stop={newStop}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
}
