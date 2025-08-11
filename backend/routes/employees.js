import express from 'express';
import { getEmployees, addEmployee, updateEmployee } from '../controllers/employeesController.js';

const router = express.Router();

router.get('/', getEmployees);
router.post('/', addEmployee);
router.put('/:id', updateEmployee);


export default router;
