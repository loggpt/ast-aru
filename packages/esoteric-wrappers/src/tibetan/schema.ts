import { z } from 'zod';

export const TibetanOutputSchema = z.object({
    rabjung: z.number(),
    lunarDay: z.number().optional(), // Will populate if using full lunar calendar map, else left optional
    dailyMewa: z.number().min(1).max(9),
    element: z.enum(['Wood', 'Fire', 'Earth', 'Metal', 'Water']),
});

export type TibetanOutput = z.infer<typeof TibetanOutputSchema>;
