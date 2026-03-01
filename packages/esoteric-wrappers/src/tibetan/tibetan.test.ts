import { describe, it, expect } from 'vitest';
import { TibetanEngine } from './index';

describe('TibetanEngine', () => {
    it('should correctly calculate the Rabjung cycle for a modern date', () => {
        // Year 1027 is the 1st Rabjung. Year 1987 is the 17th Rabjung.
        // Therefore, 2024 is in the 17th Rabjung.
        const date = new Date('2024-03-01T12:00:00.000Z');
        const result = TibetanEngine.calculate(date);

        expect(result.rabjung).toBe(17);
        expect(result.dailyMewa).toBeGreaterThanOrEqual(1);
        expect(result.dailyMewa).toBeLessThanOrEqual(9);
        expect(['Wood', 'Fire', 'Earth', 'Metal', 'Water']).toContain(result.element);
    });
});
