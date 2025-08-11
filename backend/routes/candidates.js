import express from 'express';
import { getCandidates ,reviewCandidate } from '../controllers/candidatesController.js';

const router = express.Router();
router.get('/', getCandidates);
router.put('/:id/review', reviewCandidate);
export default router;

