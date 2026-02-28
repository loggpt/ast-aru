import { z } from 'zod';

export const BaZiOutputSchema = z.object({
  pillars: z.object({
    year: z.object({ heavenlyStem: z.string(), earthlyBranch: z.string() }),
    month: z.object({ heavenlyStem: z.string(), earthlyBranch: z.string() }),
    day: z.object({ heavenlyStem: z.string(), earthlyBranch: z.string() }),
    hour: z.object({ heavenlyStem: z.string(), earthlyBranch: z.string() }),
  }),
  elementBalance: z.object({
    wood: z.number(),
    fire: z.number(),
    earth: z.number(),
    metal: z.number(),
    water: z.number(),
  }),
  dayMaster: z.string(),
});

export type BaZiOutput = z.infer<typeof BaZiOutputSchema>;
