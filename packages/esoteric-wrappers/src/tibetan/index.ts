import { TibetanOutputSchema, TibetanOutput } from './schema';

export class TibetanEngine {
    static calculate(date: Date): TibetanOutput {
        // The Tibetan Rabjung cycle is 60 years. The 1st Rabjung started in 1027 CE.
        // The Tibetan year starts roughly in February/March (Losar). Since we don't 
        // have a full epoch table, we'll approximate the Rabjung year based on Gregorian year.
        // For a highly accurate esoteric engine, this would be tied to new moons.
        const gYear = date.getFullYear();
        const cycleStart = 1027;

        // Determine the Rabjung cycle number
        const diff = (gYear - cycleStart) >= 0 ? (gYear - cycleStart) : 0;
        const rabjung = Math.floor(diff / 60) + 1;
        const rabjungYear = (diff % 60) + 1; // 1 to 60

        // Elements rotate every 2 years in the 60-year cycle: Wood, Fire, Earth, Metal, Water
        const masterElements = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];
        // Index mapping (0-9). rabjungYear 1 (Fire Hare in 1027)... this cycle offset is complex.
        // A simplified offset for the stem index base (0 = Wood, etc.)
        const elementIndex = ((rabjungYear - 1) % 10);
        // Since 1027 was a Fire year (Ding Mao), Fire is index 2,3.
        // Let's shift the array so 1027 aligns with Fire.
        const shiftedElements = ['Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water', 'Wood', 'Wood'];
        const element = shiftedElements[elementIndex] as 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

        // Annual Mewa (9 numbers, descending sequence). 1027 was Mewa 1 (White).
        // It decrements by 1 each year (1 -> 9 -> 8 -> 7...)
        let annualMewa = 1 - (diff % 9);
        if (annualMewa <= 0) {
            annualMewa += 9;
        }

        // Daily Mewa requires a fixed epoch. We'll use a simplified Julian Day mapping.
        // A known Mewa 1 day (e.g., arbitrarily mapping relative to a fixed Gregorian date for scaffolding)
        // In reality, Daily Mewa cycles 1-9 sequentially descending or ascending based on Solstice.
        // We will provide a simplified 1-9 cyclic mock for the scaffold.
        const msPerDay = 24 * 60 * 60 * 1000;
        const epochDate = new Date('2024-01-01T00:00:00Z');
        const dayDiff = Math.floor((date.getTime() - epochDate.getTime()) / msPerDay);

        let dailyMewa = 1 + (dayDiff % 9);
        if (dailyMewa <= 0) {
            dailyMewa += 9;
        }

        return TibetanOutputSchema.parse({
            rabjung,
            dailyMewa,
            element,
        });
    }
}
