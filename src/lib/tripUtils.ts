import type { Trip } from "../types/trip";

export function calculateTotalCost(trip: Trip): number {
  return trip.days.reduce((total, day) => {
    return total + day.stops.reduce((dayTotal, stop) => {
      return dayTotal + (stop.estimatedCost || 0);
    }, 0);
  }, 0);
}
