import express from 'express';
import { getPayroll,updatePayrollStatus } from '../controllers/payrollController.js';

const router = express.Router();
router.get('/', getPayroll);
router.put("/:id", updatePayrollStatus);
export default router;
