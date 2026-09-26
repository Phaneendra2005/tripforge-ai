export type Category =
  | "culture"
  | "food"
  | "nature"
  | "activity"
  | "shopping"
  | "transport"
  | "relaxation";

export interface Stop {
  id: string;
  time: string;
  title: string;
  category: Category;
  durationMinutes: number;
  estimatedCost: number;
  description: string;
}

export interface Day {
  day: number;
  title: string;
  summary: string;
  stops: Stop[];
}

export interface Trip {
  trip: {
    destination: string;
    durationDays: number;
    title: string;
    summary: string;
    travelStyle: string;
    budget: {
      currency: string;
      estimatedTotal: number;
    };
  };
  days: Day[];
}

export interface GenerateTripResponse {
  success: boolean;
  data?: Trip;
  error?: {
    code: string;
    message: string;
  };
}

export interface RegenerateStopResponse {
  success: boolean;
  data?: {
    stop: Stop;
  };
  error?: {
    code: string;
    message: string;
  };
}
