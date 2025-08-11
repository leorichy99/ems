import express from 'express';
import { getHRStats, getDepartmentOverview } from '../controllers/hrController.js';

const router = express.Router();

router.get('/stats', getHRStats);
router.get('/departments', getDepartmentOverview);

export default router;
