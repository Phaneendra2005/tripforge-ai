import { z } from "zod";

export const stopSchema = z.object({
  id: z.string().min(1),
  time: z.string().min(1),
  title: z.string().min(1),
  category: z.enum([
    "culture",
    "food",
    "nature",
    "activity",
    "shopping",
    "transport",
    "relaxation",
  ]),
  durationMinutes: z.number().int().positive(),
  estimatedCost: z.number().nonnegative(),
  description: z.string().min(1),
});

export const daySchema = z.object({
  day: z.number().int().positive(),
  title: z.string().min(1),
  summary: z.string().min(1),
  stops: z.array(stopSchema).min(1),
});

export const tripSchema = z.object({
  trip: z.object({
    destination: z.string().min(1),
    durationDays: z.number().int().positive(),
    title: z.string().min(1),
    summary: z.string().min(1),
    travelStyle: z.string().min(1),
    budget: z.object({
      currency: z.string().min(1),
      estimatedTotal: z.number().nonnegative(),
    }),
  }),
  days: z.array(daySchema).min(1),
});

export type Stop = z.infer<typeof stopSchema>;
export type Day = z.infer<typeof daySchema>;
export type Trip = z.infer<typeof tripSchema>;
