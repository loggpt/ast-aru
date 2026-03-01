import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/server';

describe('POST /api/v1/timing/analyze', () => {
    it('should return aggregated esoteric timings for a valid timestamp and coordinate (Mumbai)', async () => {
        const payload = {
            latitude: 19.0760,
            longitude: 72.8777,
            timestamp: '2026-03-01T07:53:00.000Z'
        };

        const response = await request(app)
            .post('/api/v1/timing/analyze')
            .send(payload)
            .expect(200);

        const { status, data } = response.body;
        expect(status).toBe('success');
        expect(data).toBeDefined();

        // The unified contract enforces these 6 engines are present
        expect(data.bazi).toBeDefined();
        expect(data.zmanim).toBeDefined();
        expect(data.adhan).toBeDefined();
        expect(data.jalali).toBeDefined();
        expect(data.tibetan).toBeDefined();
        expect(data.mayan).toBeDefined();

        // Check specific shape validation for Mayan (the latest)
        expect(data.mayan.kin).toBeTypeOf('number');
        expect(data.mayan.seal).toBeTypeOf('string');
    });

    it('should enforce 400 Bad Request for invalid payload shapes', async () => {
        // Missing timestamp
        const payload = {
            latitude: 19.0760,
            longitude: 72.8777
        };

        await request(app)
            .post('/api/v1/timing/analyze')
            .send(payload)
            .expect(400);
    });
});
