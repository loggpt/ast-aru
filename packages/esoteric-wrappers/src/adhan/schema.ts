import { z } from 'zod';

export const AdhanOutputSchema = z.object({
    isPrayerTime: z.boolean(),
    currentPrayer: z.string(),
    nextPrayer: z.string(),
    nextPrayerTime: z.string(),
    prayerTimes: z.object({
        fajr: z.string(),
        sunrise: z.string(),
        dhuhr: z.string(),
        asr: z.string(),
        maghrib: z.string(),
        isha: z.string(),
    }),
});

export type AdhanOutput = z.infer<typeof AdhanOutputSchema>;
