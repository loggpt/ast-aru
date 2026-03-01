import { describe, it, expect } from 'vitest';
import { MayanEngine } from './index';

describe('MayanEngine (Dreamspell Tzolkin)', () => {
    it('should correctly calculate the Dreamspell Kin for July 26, 1987', () => {
        // July 26, 1987 is known as White Galactic Wizard
        // Kin: 34, Tone: 8, Seal: White Wizard
        const date = new Date('1987-07-26T12:00:00.000Z');
        const result = MayanEngine.calculate(date);

        expect(result.kin).toBe(34);
        expect(result.tone).toBe(8);
        expect(result.seal).toBe('White Wizard');
    });
});
