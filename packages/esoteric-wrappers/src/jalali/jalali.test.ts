import { describe, it, expect } from 'vitest';
import { JalaliEngine } from './index';

describe('JalaliEngine', () => {
    it('should correctly convert a known Gregorian date to Jalali', () => {
        // March 1, 2024 -> Esfand 11, 1402 (Winter)
        const date = new Date('2024-03-01T12:00:00.000Z');
        const result = JalaliEngine.calculate(date);

        expect(result.jYear).toBe(1402);
        expect(result.jMonth).toBe(12);
        expect(result.jDay).toBe(11);
        expect(result.season).toBe('Winter');
        expect(result.isNowruz).toBe(false);
    });

    it('should correctly identify Nowruz (Persian New Year)', () => {
        // March 20, 2024 is Nowruz (Farvardin 1, 1403)
        const date = new Date('2024-03-20T12:00:00.000Z');
        const result = JalaliEngine.calculate(date);

        expect(result.jYear).toBe(1403);
        expect(result.jMonth).toBe(1);
        expect(result.jDay).toBe(1);
        expect(result.season).toBe('Spring');
        expect(result.isNowruz).toBe(true);
    });
});
