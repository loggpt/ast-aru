import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import timingRouter from './routes/timing';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Mount the timing analysis router under the v1 API namespace
app.use('/api/v1/timing', timingRouter);
