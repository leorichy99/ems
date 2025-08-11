import express from 'express';
import { getTasksByAssignedTo, updateTaskStatus,getTasksByAssignedBy ,createTask} from '../controllers/tasksController.js';

const router = express.Router();

router.get('/', getTasksByAssignedTo);
router.get('/view', getTasksByAssignedBy);
router.post('/view', createTask);
router.put('/:id/status', updateTaskStatus);

export default router;
 