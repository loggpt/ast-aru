import { z } from 'zod';

export const JalaliOutputSchema = z.object({
    jYear: z.number(),
    jMonth: z.number(),
    jDay: z.number(),
    season: z.enum(['Spring', 'Summer', 'Autumn', 'Winter']),
    isNowruz: z.boolean(),
});

export type JalaliOutput = z.infer<typeof JalaliOutputSchema>;
