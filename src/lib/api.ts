import { API_BASE_URL } from "./constants";
import { tripSchema, stopSchema } from "../../server/schemas";
import type { GenerateTripResponse, RegenerateStopResponse, Trip, Day, Stop } from "../types/trip";

export async function generateTripRequest(
  prompt: string,
  signal?: AbortSignal
): Promise<GenerateTripResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/generate-trip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
      signal,
    });

    if (!res.ok) {
      try {
        const errorData = await res.json();
        return errorData;
      } catch (e) {
        return {
          success: false,
          error: { code: "SERVER_ERROR", message: "Failed to connect to the server." },
        };
      }
    }

    const result = await res.json();

    if (result.success) {
      if (!result.data || typeof result.data !== "object") {
        return {
          success: false,
          error: { code: "INVALID_SCHEMA", message: "The AI response didn't match the format TripForge AI expects. Please try again." }
        };
      }

      const validation = tripSchema.safeParse(result.data);
      if (!validation.success) {
        console.error("Invalid AI trip response:", validation.error);
        return {
          success: false,
          error: { code: "INVALID_SCHEMA", message: "The AI response didn't match the format TripForge AI expects. Please try again." }
        };
      }
      return { success: true, data: validation.data };
    }

    return result;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw error;
    }
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Network error occurred." },
    };
  }
}

export async function regenerateStopRequest(
  trip: Trip,
  day: Day,
  stop: Stop,
  instruction: string,
  signal?: AbortSignal
): Promise<RegenerateStopResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/regenerate-stop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trip, day, stop, instruction }),
      signal,
    });

    if (!res.ok) {
      try {
        const errorData = await res.json();
        return errorData;
      } catch (e) {
        return {
          success: false,
          error: { code: "SERVER_ERROR", message: "Failed to connect to the server." },
        };
      }
    }

    const result = await res.json();

    if (result.success) {
      if (!result.data || typeof result.data !== "object" || !result.data.stop) {
        return {
          success: false,
          error: { code: "INVALID_SCHEMA", message: "The AI response didn't match the format TripForge AI expects. Your trip is unchanged. Please try again." }
        };
      }

      // Validate that the nested stop object matches our schema
      const validation = stopSchema.safeParse(result.data.stop);
      if (!validation.success) {
        console.error("Invalid AI stop response:", validation.error);
        return {
          success: false,
          error: { code: "INVALID_SCHEMA", message: "The AI response didn't match the format TripForge AI expects. Your trip is unchanged. Please try again." }
        };
      }
      return { success: true, data: { stop: validation.data } };
    }

    return result;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw error;
    }

    if (error instanceof SyntaxError || error?.name === "SyntaxError") {
      return {
        success: false,
        error: {
          code: "INVALID_JSON",
          message:
            "The AI returned an invalid response. Your trip is unchanged. Please try again.",
        },
      };
    }

    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Network error occurred." },
    };
  }
}
