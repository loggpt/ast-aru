import { z } from 'zod';

export const ZmanimOutputSchema = z.object({
  isShabbat: z.boolean(),
  nextSunset: z.string(),
  chatzot: z.string(),
});

export type ZmanimOutput = z.infer<typeof ZmanimOutputSchema>;
