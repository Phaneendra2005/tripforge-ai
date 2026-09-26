# TripForge AI

Turn a travel idea into a structured itinerary you can actually edit.

TripForge AI is an AI-powered trip planning application that converts a free-form travel request into a structured, validated, and interactive itinerary. Users can edit, remove, add, and reorder stops, recalculate budgets dynamically, and regenerate individual stops using AI.

## Demo

**Live Demo:** https://tripforge-ai-rho.vercel.app/

**GitHub:** https://github.com/Phaneendra2005/tripforge-ai

---

## Features

- Free-form travel planning
- Structured AI JSON output
- Runtime validation with Zod
- Interactive day-by-day itinerary
- Expand/collapse itinerary days
- Edit existing stops
- Add new stops manually
- Remove stops
- Reorder stops
- AI-powered individual stop regeneration
- Dynamic budget calculation
- Local trip persistence using localStorage
- Structured JSON preview
- Loading, success, empty, and error states
- Defensive handling of malformed JSON and invalid schemas
- Network and API failure handling
- Request cancellation with AbortController
- Stale-response protection
- Responsive mobile-friendly UI
- Backend API key protection

---

## Architecture

```text
User
  ↓
React + TypeScript
  ↓
Express API
  ↓
Gemini API
  ↓
Structured JSON
  ↓
Backend Validation
  ↓
Zod Schema Validation
  ↓
React State
  ↓
Interactive Itinerary
```

The Gemini API is accessed through the backend so the API key is never exposed to the browser.

---

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Lucide React

### Backend

- Node.js
- Express
- TypeScript
- Google Generative AI
- Gemini 2.5 Flash
- Zod

### Development

- npm
- Git
- GitHub

---

## Project Structure

```text
tripforge-ai/
├── public/
├── server/
│   ├── generateTrip.ts
│   ├── index.ts
│   ├── regenerateStop.ts
│   └── schemas.ts
├── src/
│   ├── components/
│   ├── lib/
│   ├── types/
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Phaneendra2005/tripforge-ai.git
cd tripforge-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Optional frontend API URL:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### 4. Start the application

```bash
npm start
```

This starts both the frontend and backend.

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:3001
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google Gemini API key used by the backend |
| `VITE_API_BASE_URL` | No | Express API URL. Defaults to `http://localhost:3001/api` |

**Security:** Never expose `GEMINI_API_KEY` in frontend code or commit the `.env` file to GitHub.

---

## How It Works

1. The user enters a natural-language travel request.
2. React sends the request to the Express backend.
3. The backend constructs the AI prompt and requests structured output from Gemini.
4. Gemini returns itinerary data in JSON format.
5. The backend validates the generated data using Zod.
6. Only validated data is returned to the frontend.
7. React renders the itinerary as interactive components.
8. Users can edit, add, remove, and reorder stops.
9. The total budget is recalculated from the current itinerary state.
10. Individual stops can be regenerated through Gemini without replacing the entire trip.

---

## Structured AI Output

TripForge AI uses structured JSON instead of relying on free-form LLM text.

A simplified itinerary structure looks like:

```json
{
  "destination": "Bangalore",
  "duration": 2,
  "totalBudget": 6140,
  "days": [
    {
      "day": 1,
      "title": "Explore Bangalore",
      "stops": [
        {
          "title": "Cubbon Park",
          "time": "09:00",
          "type": "Nature",
          "duration": 90,
          "cost": 300
        }
      ]
    }
  ]
}
```

The actual application validates the complete structure using Zod before storing it in React state.

---

## Failure Handling

TripForge AI is designed to prevent malformed AI responses from breaking the UI.

### Malformed JSON

If the AI/API returns invalid JSON, the frontend catches the parsing failure and displays a controlled error state instead of crashing.

### Invalid Schema

If the response is valid JSON but does not match the expected itinerary or stop structure, Zod rejects it before the data reaches React state.

### Empty or Invalid Responses

Unexpected empty or structurally invalid responses are converted into controlled application errors.

### Network/API Failures

Server failures, unavailable AI services, and network errors are surfaced through user-friendly error states with a retry action.

### API Rate Limits

If the Gemini API returns a rate-limit or quota failure, the backend failure is surfaced to the frontend instead of allowing the request to break the application.

### Request Cancellation

`AbortController` is used to cancel in-flight requests when necessary.

### Stale Responses

Request tracking and cancellation prevent an older AI response from overwriting a newer user request.

For example:

```text
Request A → slow
Request B → fast

Request B completes
        ↓
UI displays Request B

Request A completes later
        ↓
Ignored
```

This prevents stale AI results from replacing the user's latest itinerary.

---

## Interactive Editing

Generated itineraries are not static AI output.

Users can:

- Edit stop details
- Remove stops
- Add new stops
- Reorder stops
- Collapse or expand itinerary days
- Regenerate an individual stop with AI

The UI updates immediately after local changes.

---

## Dynamic Budget Calculation

The budget is derived from the current itinerary state rather than relying on a stale AI-generated total.

For example:

```text
Initial stops
    ↓
Calculate total cost

User edits a stop
    ↓
Recalculate

User removes a stop
    ↓
Recalculate

User adds a stop
    ↓
Recalculate

User regenerates a stop
    ↓
Recalculate
```

This keeps the displayed budget synchronized with the actual itinerary.

---

## Persistence

The current itinerary is persisted using browser `localStorage`.

This allows the generated trip and user edits to survive a page refresh.

The application also validates stored data before restoring it. Invalid or corrupted stored itinerary data is safely rejected instead of being rendered.

Future versions could move persistence to a database to support user accounts and cross-device synchronization.

---

## Why Structured JSON?

Raw LLM text is unpredictable and difficult to render reliably as individual editable components.

Structured JSON gives the application a predictable data model that can be validated and transformed into React UI components.

This makes the AI output easier to:

- Validate
- Render
- Edit
- Persist
- Recalculate
- Regenerate safely

---

## Why Zod?

TypeScript types disappear at runtime.

An LLM can return data that does not match a TypeScript interface even when the code compiles successfully.

Zod provides runtime validation:

```text
Gemini Response
      ↓
JSON Parsing
      ↓
Zod Validation
      ↓
Valid Data → React
      ↓
Invalid Data → Controlled Error
```

This prevents untrusted AI-generated data from directly entering application state.

---

## Why a Backend Proxy?

The Gemini API key must not be exposed in browser-side code.

The application therefore follows this architecture:

```text
Browser
   ↓
Express Backend
   ↓
Gemini API
```

The API key is stored in the backend environment and is never included in the frontend bundle.

---

## Deployment

### Backend

The backend can be deployed using platforms such as Render or another Node.js-compatible hosting provider.

Configure:

```env
GEMINI_API_KEY=your_gemini_api_key
```

For production, configure CORS to allow requests only from the deployed frontend origin.

Example:

```ts
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
```

Set:

```env
FRONTEND_URL=https://your-frontend-domain.com
```

The backend should listen on the hosting provider's assigned port.

### Frontend

The frontend can be deployed using platforms such as Vercel or Netlify.

Configure:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

Build the frontend with:

```bash
npm run build
```

The generated production files are placed in:

```text
dist/
```

### Important Security Rule

Do **not** put:

```env
GEMINI_API_KEY
```

inside frontend environment variables such as:

```env
VITE_GEMINI_API_KEY
```

Only the backend should have access to the Gemini API key.

---

## Production Build

The frontend production build can be verified with:

```bash
npm run build
```

The project currently builds successfully using Vite.

---

## AI Usage Note

AI coding assistants were used during development for brainstorming, implementation assistance, debugging, testing guidance, and documentation.

All generated code was reviewed, tested, adapted, and understood by the author.

---

## Known Limitations

- Estimated prices are AI-generated approximations and may not accurately reflect current local prices.
- The application does not currently verify live opening hours or seasonal availability.
- The itinerary is planning guidance and is not real-time navigation.
- AI-generated recommendations may require user verification before making bookings.
- Cross-device persistence and user accounts are not currently implemented.
- Live maps, weather, and real-time place availability are not currently integrated.

---

## Future Improvements

- Google Maps or another mapping provider integration
- Real-time place availability and opening hours
- Weather-aware itinerary planning
- Database-backed trip persistence
- User authentication
- Cross-device synchronization
- Collaborative trip editing
- More advanced budget optimization
- Real-time travel alerts

---

## Interview Talking Points

### Why structured JSON?

Raw LLM output is unpredictable and difficult to render as reliable UI components. Structured JSON provides a predictable contract between the AI service and the application.

### Why Zod?

TypeScript provides compile-time type safety, but AI responses arrive at runtime. Zod validates the actual runtime response before it enters application state.

### Why backend proxy?

The backend keeps the Gemini API key away from the browser and prevents the secret from being exposed in the client bundle.

### How do you prevent stale responses?

The application uses request tracking and `AbortController`. When a newer request becomes active, an older request cannot overwrite the latest application state.

### What happens if AI returns malformed JSON?

The JSON parsing operation is handled defensively. Instead of allowing the exception to crash the UI, the application displays a controlled error state and allows the user to retry.

### What happens if the schema is wrong?

Zod rejects the response before it reaches React state. The existing itinerary remains unchanged.

### Why calculate the budget on the frontend?

The itinerary is editable. Therefore, the budget must be derived from the current itinerary state instead of relying on a stale AI-generated total.

---

## Time Spent

Approximate time spent: 8 hours.

---

## License

This project was created as part of a frontend internship assignment.
