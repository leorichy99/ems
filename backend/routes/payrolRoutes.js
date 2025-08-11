import express from 'express';
import { getPayrollByUser } from '../controllers/payrolController.js';

const router = express.Router();

router.get('/:userId', getPayrollByUser);

export default router;
