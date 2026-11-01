import { Router, Request, Response } from 'express';
import { env } from '../config/env.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'VIT-Health API Backend Operational',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: '1.0.0',
    disclaimer: 'Academic Prototype proposed for VTOP (VIT Bhopal)'
  });
});

export default router;
