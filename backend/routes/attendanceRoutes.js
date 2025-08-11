import express from 'express';
import { getAttendance, addAttendance } from '../controllers/attendanceController.js';

const router = express.Router();

// GET attendance by date
router.get('/', getAttendance);

// POST new attendance
router.post('/', addAttendance);

export default router;
