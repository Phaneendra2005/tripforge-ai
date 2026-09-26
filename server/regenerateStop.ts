import { GoogleGenerativeAI, type Schema, SchemaType } from "@google/generative-ai";
import { stopSchema } from "./schemas.ts";
import type { Trip, Day, Stop } from "../src/types/trip.ts";

export async function regenerateStop(
  trip: Trip,
  day: Day,
  stop: Stop,
  instruction: string
) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const systemInstruction = `You are an expert travel planner. Return ONLY valid JSON.
No Markdown. No code fences. No explanation.
Follow the exact JSON schema provided to return ONE single stop.
You are replacing a specific stop in an itinerary based on user instructions.
Ensure the new stop fits logically within the day's timeline and the overall trip context.
Generate a new unique ID for the stop.
`;

  const contextText = `
Trip Context:
Destination: ${trip.trip.destination}
Travel Style: ${trip.trip.travelStyle}

Day Context:
Title: ${day.title}
Summary: ${day.summary}

Original Stop:
${JSON.stringify(stop, null, 2)}

User Instruction for replacement:
"${instruction}"
`;

  const responseSchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
      stop: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          time: { type: SchemaType.STRING },
          title: { type: SchemaType.STRING },
          category: {
            type: SchemaType.STRING,
            format: "enum",
            enum: ["culture", "food", "nature", "activity", "shopping", "transport", "relaxation"],
          },
          durationMinutes: { type: SchemaType.INTEGER },
          estimatedCost: { type: SchemaType.NUMBER },
          description: { type: SchemaType.STRING },
        },
        required: ["id", "time", "title", "category", "durationMinutes", "estimatedCost", "description"],
      }
    },
    required: ["stop"]
  };

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: contextText }] }],
    systemInstruction,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const responseText = result.response.text();

  try {
    const rawData = JSON.parse(responseText);
    const validatedStop = stopSchema.parse(rawData.stop);
    return { stop: validatedStop };
  } catch (error) {
    console.error("Validation error:", error);
    throw new Error("INVALID_SCHEMA");
  }
}
