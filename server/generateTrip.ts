import { GoogleGenerativeAI, type Schema, SchemaType } from "@google/generative-ai";
import { tripSchema } from "./schemas.ts";

export async function generateTrip(prompt: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const systemInstruction = `You are an expert travel planner. Return ONLY valid JSON.
No Markdown. No code fences. No explanation.
Follow the exact JSON schema provided.
Every stop MUST have a unique ID (e.g. uuid or a random unique string).
Do not invent impossible numerical values. Estimated costs should be realistic.
Respect requested duration and user's preferences.
Create realistic day ordering. Keep the itinerary practical.
Avoid excessive stops. Include reasonable time spacing.
Return between 2 and 6 stops per day.`;

  const responseSchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
      trip: {
        type: SchemaType.OBJECT,
        properties: {
          destination: { type: SchemaType.STRING },
          durationDays: { type: SchemaType.INTEGER },
          title: { type: SchemaType.STRING },
          summary: { type: SchemaType.STRING },
          travelStyle: { type: SchemaType.STRING },
          budget: {
            type: SchemaType.OBJECT,
            properties: {
              currency: { type: SchemaType.STRING },
              estimatedTotal: { type: SchemaType.NUMBER },
            },
            required: ["currency", "estimatedTotal"],
          },
        },
        required: ["destination", "durationDays", "title", "summary", "travelStyle", "budget"],
      },
      days: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            day: { type: SchemaType.INTEGER },
            title: { type: SchemaType.STRING },
            summary: { type: SchemaType.STRING },
            stops: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  id: { type: SchemaType.STRING },
                  time: { type: SchemaType.STRING },
                  title: { type: SchemaType.STRING },
                  category: { 
                    type: SchemaType.STRING,
                    format: "enum",
                    enum: ["culture", "food", "nature", "activity", "shopping", "transport", "relaxation"]
                  },
                  durationMinutes: { type: SchemaType.INTEGER },
                  estimatedCost: { type: SchemaType.NUMBER },
                  description: { type: SchemaType.STRING },
                },
                required: ["id", "time", "title", "category", "durationMinutes", "estimatedCost", "description"],
              },
            },
          },
          required: ["day", "title", "summary", "stops"],
        },
      },
    },
    required: ["trip", "days"],
  };

  const result = await model.generateContent({
    contents: [
      { role: "user", parts: [{ text: prompt }] }
    ],
    systemInstruction,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const responseText = result.response.text();
  
  try {
    const rawData = JSON.parse(responseText);
    const validatedData = tripSchema.parse(rawData);
    return validatedData;
  } catch (error) {
    console.error("Validation error:", error);
    throw new Error("INVALID_SCHEMA");
  }
}
