import express from 'express';
import { getPerformance,addPerformance } from '../controllers/performanceController.js';

const router = express.Router();

router.get('/', getPerformance);
router.post('/', addPerformance);

export default router;
