// routes/exitRoutes.js
import express from 'express';
import { createExitRequest, getExitRequests ,approveExitRequest } from '../controllers/exitController.js';

const router = express.Router();

router.post('/', createExitRequest);
router.get('/', getExitRequests);
router.put('/:id/approve', approveExitRequest);

export default router;
