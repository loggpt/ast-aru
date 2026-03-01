import * as jalaali from 'jalaali-js';
import { JalaliOutput, JalaliOutputSchema } from './schema';

export class JalaliEngine {
    static calculate(date: Date): JalaliOutput {
        const { jy, jm, jd } = jalaali.toJalaali(date);

        let season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
        if (jm >= 1 && jm <= 3) {
            season = 'Spring';
        } else if (jm >= 4 && jm <= 6) {
            season = 'Summer';
        } else if (jm >= 7 && jm <= 9) {
            season = 'Autumn';
        } else {
            season = 'Winter';
        }

        const isNowruz = jm === 1 && jd === 1;

        return JalaliOutputSchema.parse({
            jYear: jy,
            jMonth: jm,
            jDay: jd,
            season,
            isNowruz,
        });
    }
}
