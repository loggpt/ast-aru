import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
    BaZiEngine,
    ZmanimEngine,
    AdhanEngine,
    JalaliEngine,
    TibetanEngine,
    MayanEngine
} from 'esoteric-wrappers';

const router = Router();

// Strict runtime validation for the incoming payload
const AnalyzeRequestSchema = z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    timestamp: z.string().datetime() // ISO 8601 string required
});

router.post('/analyze', async (req: Request, res: Response) => {
    try {
        const payload = AnalyzeRequestSchema.parse(req.body);
        const date = new Date(payload.timestamp);

        // Run all 6 engines concurrently to minimize latency overhead
        const [bazi, zmanim, adhan, jalali, tibetan, mayan] = await Promise.all([
            Promise.resolve(BaZiEngine.calculate(date, { lat: payload.latitude, lon: payload.longitude })),
            Promise.resolve(ZmanimEngine.calculate(date, payload.latitude, payload.longitude)),
            Promise.resolve(AdhanEngine.calculate(date, payload.latitude, payload.longitude)),
            Promise.resolve(JalaliEngine.calculate(date)),
            Promise.resolve(TibetanEngine.calculate(date)),
            Promise.resolve(MayanEngine.calculate(date))
        ]);

        const aggregatedResponse = {
            status: 'success',
            data: {
                bazi,
                zmanim,
                adhan,
                jalali,
                tibetan,
                mayan
            }
        };

        res.status(200).json(aggregatedResponse);
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation Failed', details: err.errors });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

export default router;
