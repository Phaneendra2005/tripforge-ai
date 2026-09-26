import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateTrip } from "./generateTrip.ts";
import { regenerateStop } from "./regenerateStop.ts";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.post("/api/generate-trip", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_INPUT", message: "A valid prompt string is required." },
      });
    }

    const tripData = await generateTrip(prompt);

    res.json({
      success: true,
      data: tripData,
    });
  } catch (error: any) {
    console.error("Error generating trip:", error);

    let code = "SERVER_ERROR";
    let message = "An unexpected error occurred.";

    if (error.message === "INVALID_SCHEMA") {
      code = "INVALID_SCHEMA";
      message = "The AI returned data we couldn't safely use.";
    } else if (error.message === "GEMINI_API_KEY is missing") {
      code = "SERVER_ERROR";
      message = "Server configuration error.";
    }

    res.status(500).json({
      success: false,
      error: { code, message },
    });
  }
});

app.post("/api/regenerate-stop", async (req, res) => {
  try {
    const { trip, day, stop, instruction } = req.body;

    if (!trip || !day || !stop || !instruction) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_INPUT", message: "Missing required fields." },
      });
    }

    const newStopData = await regenerateStop(trip, day, stop, instruction);

    res.json({
      success: true,
      data: newStopData,
    });
  } catch (error: any) {
    console.error("Error regenerating stop:", error);

    let code = "SERVER_ERROR";
    let message = "An unexpected error occurred.";

    if (error.message === "INVALID_SCHEMA") {
      code = "INVALID_SCHEMA";
      message = "The AI returned data we couldn't safely use.";
    }

    res.status(500).json({
      success: false,
      error: { code, message },
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});