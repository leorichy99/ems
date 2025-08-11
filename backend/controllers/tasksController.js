import { db } from '../db/connection.js';

export const getTasksByAssignedTo = async (req, res) => { 
  const assignedTo = req.query.assignedTo;
  if (!assignedTo) {
    return res.status(400).json({ error: 'assignedTo query parameter is required' });
  }

  try {
    const [rows] = await db.query(
      `SELECT id, title, description, priority, status, due_date, assigned_by, created_at, updated_at 
       FROM tasks WHERE assigned_to = ?`,
      [assignedTo]
    );
    res.json(rows);
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
};

export const getTasksByAssignedBy = async (req, res) => {
  const assignedBy = req.query.assignedBy;
  if (!assignedBy) {
    return res.status(400).json({ error: 'assignedBy query parameter is required' });
  }

  try {
    const [rows] = await db.query(
      `SELECT id, title, description, priority, status, due_date, assigned_by, assigned_to, created_at, updated_at 
       FROM tasks WHERE assigned_by = ?`,
      [assignedBy]
    );
    res.json(rows);
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
};




export const updateTaskStatus = async (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;

  const validStatuses = ['pending', 'in-progress', 'completed', 'overdue'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const [result] = await db.query(
      `UPDATE tasks SET status = ?, updated_at = NOW() WHERE id = ?`,
      [status, taskId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: 'Database update failed' });
  }
};


export const createTask = async (req, res) => {
  const { title, description, priority, due_date, assigned_to, status } = req.body;

  // Basic validation (add more as needed)
  if (!title || !assigned_to || !due_date || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {

    const assigned_by = req.body.assigned_by || null;

    const [result] = await db.query(
      `INSERT INTO tasks (title, description, priority, due_date, assigned_to, status, assigned_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [title, description, priority || null, due_date, assigned_to, status, assigned_by]
    );

    res.status(201).json({ message: 'Task created successfully', taskId: result.insertId });
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

