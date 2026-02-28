import { describe, it, expect } from 'vitest';
import { ZmanimEngine } from './index';

describe('ZmanimEngine', () => {
    it('should detect when it is NOT Shabbat (e.g. Wednesday)', () => {
        // Wednesday, March 4, 2026, 12:00 PM UTC
        const date = new Date('2026-03-04T12:00:00.000Z');
        // Coordinates for Jerusalem
        const result = ZmanimEngine.calculate(date, 31.7683, 35.2137);

        expect(result.isShabbat).toBe(false);
        expect(typeof result.nextSunset).toBe('string');
        expect(typeof result.chatzot).toBe('string');
    });

    it('should detect when it IS Shabbat (Friday evening)', () => {
        // Friday, March 6, 2026, 8:00 PM UTC (After sunset in Jerusalem)
        const date = new Date('2026-03-06T20:00:00.000Z');
        const result = ZmanimEngine.calculate(date, 31.7683, 35.2137);

        expect(result.isShabbat).toBe(true);
    });
});
