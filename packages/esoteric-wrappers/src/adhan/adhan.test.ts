import { describe, it, expect } from 'vitest';
import { AdhanEngine } from './index';

describe('AdhanEngine', () => {
    it('should calculate prayer times and detect when it is NOT prayer time', () => {
        // Arbitrary time not near a prayer (e.g., Mecca at 10:00 AM)
        const date = new Date('2026-03-05T07:00:00.000Z'); // 10:00 AM AST (UTC+3)
        const result = AdhanEngine.calculate(date, 21.4225, 39.8262);

        expect(result.isPrayerTime).toBe(false);
        expect(result.currentPrayer).toBeDefined();
        expect(result.nextPrayer).toBeDefined();
        expect(result.prayerTimes.fajr).toBeDefined();
    });

    it('should detect when it IS prayer time (within 15 mins of Dhuhr)', () => {
        // We will generate the prayer times for a static date
        const dummyDate = new Date('2026-03-05T12:00:00.000Z');
        const dummyResult = AdhanEngine.calculate(dummyDate, 21.4225, 39.8262);

        // Ensure we have a valid Dhuhr time
        expect(dummyResult.prayerTimes.dhuhr).toBeDefined();
        const dhuhrTime = new Date(dummyResult.prayerTimes.dhuhr);

        // Set test time to exactly 5 minutes before the calculated Dhuhr time
        const testDate = new Date(dhuhrTime.getTime() - (5 * 60 * 1000));

        // Re-calculate using the test date
        const result = AdhanEngine.calculate(testDate, 21.4225, 39.8262);

        // The business logic requires 'isPrayerTime' to be True within 15 mins of ANY prayer
        expect(result.isPrayerTime).toBe(true);
        expect(result.prayerTimes.dhuhr).toBeDefined();
    });
});
