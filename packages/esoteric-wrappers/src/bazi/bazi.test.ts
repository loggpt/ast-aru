import { describe, it, expect } from 'vitest';
import { BaZiEngine } from './index';

describe('BaZiEngine', () => {
  it('should calculate Bazi for a specific date', () => {
    const date = new Date('2024-03-01T12:00:00');
    const result = BaZiEngine.calculate(date);

    expect(result.pillars).toBeDefined();
    expect(result.dayMaster).toBeDefined();
    expect(result.elementBalance).toBeDefined();
    expect(typeof result.dayMaster).toBe('string');
  });
});
