import { tripSchema } from "../../server/schemas";
import type { Trip } from "../types/trip";

const STORAGE_KEY = "tripforge_current_trip";

export function saveTrip(trip: Trip): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
  } catch (error) {
    console.error("Failed to save trip to localStorage", error);
  }
}

export function loadTrip(): Trip | null {
  try {
    const dataStr = localStorage.getItem(STORAGE_KEY);
    if (!dataStr) return null;
    
    const parsedData = JSON.parse(dataStr);
    const validatedData = tripSchema.parse(parsedData);
    
    return validatedData as Trip;
  } catch (error) {
    console.error("Failed to load or validate trip from localStorage", error);
    return null;
  }
}

export function clearTrip(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear trip from localStorage", error);
  }
}
