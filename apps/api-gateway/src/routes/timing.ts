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

        // Astro-Engine HTTP Bridge
        const fetchAstroEngine = async () => {
            // In production, ASTRO_ENGINE_URL applies (via docker-compose).
            // Fallback to localhost for local dev if undefined.
            const astroEngineUrl = process.env.ASTRO_ENGINE_URL || 'http://localhost:8000';
            const response = await fetch(`${astroEngineUrl}/api/v1/astro/calculate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    latitude: payload.latitude,
                    longitude: payload.longitude,
                    timestamp: payload.timestamp
                })
            });
            if (!response.ok) {
                throw new Error(`Astro-Engine returned ${response.status}`);
            }
            return response.json();
        };

        // Run all 6 TS engines and the Python bridge concurrently
        const [bazi, zmanim, adhan, jalali, tibetan, mayan, astrologyRes] = await Promise.all([
            Promise.resolve(BaZiEngine.calculate(date, { lat: payload.latitude, lon: payload.longitude })),
            Promise.resolve(ZmanimEngine.calculate(date, payload.latitude, payload.longitude)),
            Promise.resolve(AdhanEngine.calculate(date, payload.latitude, payload.longitude)),
            Promise.resolve(JalaliEngine.calculate(date)),
            Promise.resolve(TibetanEngine.calculate(date)),
            Promise.resolve(MayanEngine.calculate(date)),
            fetchAstroEngine().catch((err) => ({ error: err.message }))
        ]);

        const aggregatedResponse = {
            status: 'success',
            data: {
                bazi,
                zmanim,
                adhan,
                jalali,
                tibetan,
                mayan,
                astrology: astrologyRes.data || astrologyRes.error
            }
        };

        res.status(200).json(aggregatedResponse);
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation Failed', details: err.errors });
        } else {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    }
});

export default router;
