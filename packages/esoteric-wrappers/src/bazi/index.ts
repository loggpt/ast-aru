import { Solar } from 'lunar-javascript';
import { BaZiOutputSchema, BaZiOutput } from './schema';

export class BaZiEngine {
  static calculate(date: Date): BaZiOutput {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();
    const eightChar = lunar.getEightChar();

    const result = {
      pillars: {
        year: { heavenlyStem: eightChar.getYearGan(), earthlyBranch: eightChar.getYearZhi() },
        month: { heavenlyStem: eightChar.getMonthGan(), earthlyBranch: eightChar.getMonthZhi() },
        day: { heavenlyStem: eightChar.getDayGan(), earthlyBranch: eightChar.getDayZhi() },
        hour: { heavenlyStem: eightChar.getTimeGan(), earthlyBranch: eightChar.getTimeZhi() },
      },
      elementBalance: {
        wood: 0,
        fire: 0,
        earth: 0,
        metal: 0,
        water: 0,
      },
      dayMaster: eightChar.getDayGan(),
    };

    const elementMap: Record<string, keyof BaZiOutput['elementBalance']> = {
      '甲': 'wood', '乙': 'wood',
      '丙': 'fire', '丁': 'fire',
      '戊': 'earth', '己': 'earth',
      '庚': 'metal', '辛': 'metal',
      '壬': 'water', '癸': 'water',
    };

    [eightChar.getYearGan(), eightChar.getMonthGan(), eightChar.getDayGan(), eightChar.getTimeGan()].forEach(s => {
      const el = elementMap[s];
      if (el) (result.elementBalance as any)[el]++;
    });

    return BaZiOutputSchema.parse(result);
  }
}
