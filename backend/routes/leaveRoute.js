import express from 'express';
import {
  getLeaveRequests,
  getLeaveRequestById,
  createLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest
} from '../controllers/leaveController.js';

const router = express.Router();

router.get('/', getLeaveRequests);
router.get('/:id', getLeaveRequestById);
router.post('/', createLeaveRequest);
router.put('/:id/approve', approveLeaveRequest);
router.put('/:id/reject', rejectLeaveRequest);

export default router;
