import { GeoLocation, ZmanimCalendar } from 'kosher-zmanim';
import { ZmanimOutputSchema, ZmanimOutput } from './schema';

export class ZmanimEngine {
    static calculate(date: Date, latitude: number, longitude: number): ZmanimOutput {
        const geo = new GeoLocation('Custom Location', latitude, longitude, 0, 'UTC');
        const calendar = new ZmanimCalendar(geo);
        calendar.setDate(date);

        let isShabbat = false;

        const dayOfWeek = date.getUTCDay();

        if (dayOfWeek === 5) { // Friday
            const sunset = calendar.getSunset();
            if (sunset !== null && date.getTime() >= sunset.toJSDate().getTime()) {
                isShabbat = true;
            }
        } else if (dayOfWeek === 6) { // Saturday
            const tzais = calendar.getTzais();
            if (tzais === null || date.getTime() < tzais.toJSDate().getTime()) {
                isShabbat = true;
            }
        }

        const nextSunset = calendar.getSunset()?.toISO() ?? '';
        const chatzot = calendar.getChatzos()?.toISO() ?? '';

        return ZmanimOutputSchema.parse({
            isShabbat,
            nextSunset,
            chatzot,
        });
    }
}
