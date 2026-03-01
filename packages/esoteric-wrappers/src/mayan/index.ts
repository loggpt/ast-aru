import { MayanOutput, MayanOutputSchema } from './schema';

export class MayanEngine {
    static calculate(date: Date): MayanOutput {
        // Known anchor: July 26, 1987 is Kin 34 (White Galactic Wizard)
        const anchorDate = new Date('1987-07-26T12:00:00.000Z');
        const anchorKin = 34;

        // To ensure exact Dreamspell matching (which halts the 260 count on Feb 29),
        // we count the number of days between the anchor and the target, omitting Feb 29ths.
        const msPerDay = 24 * 60 * 60 * 1000;

        // Normalize times to UTC noon to avoid timezone daylight saving shifts
        const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12, 0, 0));

        let diffDays = Math.round((target.getTime() - anchorDate.getTime()) / msPerDay);

        let leapDaysToIgnore = 0;
        const startY = Math.min(anchorDate.getUTCFullYear(), target.getUTCFullYear());
        const endY = Math.max(anchorDate.getUTCFullYear(), target.getUTCFullYear());

        for (let y = startY; y <= endY; y++) {
            if ((y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0)) {
                const feb29 = new Date(Date.UTC(y, 1, 29, 12, 0, 0));
                const minDate = diffDays >= 0 ? anchorDate : target;
                const maxDate = diffDays >= 0 ? target : anchorDate;

                // Exclude the 29th from the Kin drift
                if (feb29 > minDate && feb29 <= maxDate) {
                    leapDaysToIgnore++;
                }
            }
        }

        if (diffDays > 0) {
            diffDays -= leapDaysToIgnore;
        } else if (diffDays < 0) {
            diffDays += leapDaysToIgnore;
        }

        let kin = (anchorKin + diffDays) % 260;
        if (kin <= 0) kin += 260;

        const tone = ((kin - 1) % 13) + 1;

        const seals = [
            "Red Dragon", "White Wind", "Blue Night", "Yellow Seed", "Red Serpent",
            "White World-Bridger", "Blue Hand", "Yellow Star", "Red Moon", "White Dog",
            "Blue Monkey", "Yellow Human", "Red Skywalker", "White Wizard", "Blue Eagle",
            "Yellow Warrior", "Red Earth", "White Mirror", "Blue Storm", "Yellow Sun"
        ];
        const seal = seals[(kin - 1) % 20];

        return MayanOutputSchema.parse({
            kin,
            tone,
            seal
        });
    }
}
