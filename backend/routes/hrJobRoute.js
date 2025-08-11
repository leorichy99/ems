import express from 'express';
import { getJobs, createJob } from '../controllers/hrjobsController.js';

const router = express.Router();

// GET all open jobs
router.get('/', getJobs);

// POST create new job
router.post('/', createJob);

export default router;
