// routes/periodRoutes.js
import express from 'express';
import { getPeriods } from '../controllers/periodController.js';

const router = express.Router();
router.get('/', getPeriods);
export default router;
