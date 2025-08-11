import express from 'express';
import { getLeaveRequestsByUser,createLeaveRequest } from '../controllers/leaveRequestsController.js';

const router = express.Router();

router.get('/:userId', getLeaveRequestsByUser);
router.post('/leave-request', createLeaveRequest);


export default router;
