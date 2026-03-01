import { z } from 'zod';

export const MayanOutputSchema = z.object({
    kin: z.number().min(1).max(260),
    tone: z.number().min(1).max(13),
    seal: z.string(),
});

export type MayanOutput = z.infer<typeof MayanOutputSchema>;
