import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import { AdhanOutputSchema, AdhanOutput } from './schema';

export class AdhanEngine {
    static calculate(date: Date, latitude: number, longitude: number, method = CalculationMethod.MuslimWorldLeague()): AdhanOutput {
        const coordinates = new Coordinates(latitude, longitude);
        const prayerTimes = new PrayerTimes(coordinates, date, method);

        const currentPrayer = prayerTimes.currentPrayer() === 'none' ? 'none' : prayerTimes.currentPrayer();
        const nextPrayer = prayerTimes.nextPrayer() === 'none' ? 'none' : prayerTimes.nextPrayer();

        // Determine the exact Date object for the next prayer
        let nextPrayerTimeDate: Date | null = null;
        if (nextPrayer !== 'none') {
            nextPrayerTimeDate = prayerTimes.timeForPrayer(nextPrayer as any);
        }
        const nextPrayerTime = nextPrayerTimeDate ? nextPrayerTimeDate.toISOString() : '';

        // Check if within 15 mins of ANY prayer time
        let isPrayerTime = false;
        const nowMs = date.getTime();
        const fifteenMinsMs = 15 * 60 * 1000;

        const allPrayers = [
            prayerTimes.fajr,
            prayerTimes.sunrise,
            prayerTimes.dhuhr,
            prayerTimes.asr,
            prayerTimes.maghrib,
            prayerTimes.isha
        ];

        for (const pTime of allPrayers) {
            if (pTime) {
                const diff = Math.abs(nowMs - pTime.getTime());
                if (diff <= fifteenMinsMs) {
                    isPrayerTime = true;
                    break;
                }
            }
        }

        return AdhanOutputSchema.parse({
            isPrayerTime,
            currentPrayer,
            nextPrayer,
            nextPrayerTime,
            prayerTimes: {
                fajr: prayerTimes.fajr.toISOString(),
                sunrise: prayerTimes.sunrise.toISOString(),
                dhuhr: prayerTimes.dhuhr.toISOString(),
                asr: prayerTimes.asr.toISOString(),
                maghrib: prayerTimes.maghrib.toISOString(),
                isha: prayerTimes.isha.toISOString(),
            }
        });
    }
}
