// leaveRequestsController.js
import { db } from '../db/connection.js';

export const getLeaveRequestsByUser = async (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT id, employee_name, employee_id, type, start_date, end_date, days, reason, status
    FROM leave_requests
    WHERE employee_id = ?
    ORDER BY applied_date DESC
  `;

  try {
    const [results] = await db.query(query, [userId]);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error fetching leave requests' });
  }
};

// Assuming you have db.query as a Promise-based function

export const createLeaveRequest = async (req, res) => {
  try {
    const {
      employee_name,
      employee_id,
      type,
      start_date,
      end_date,
      days,
      reason
    } = req.body;

    // Default manager
    const manager = 'Richy';

    const status = 'Pending';
    const applied_date = new Date();

    const insertQuery = `
      INSERT INTO leave_requests
        (employee_name, employee_id, type, start_date, end_date, days, reason, status, applied_date, manager)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(insertQuery, [
      employee_name,
      employee_id,
      type,
      start_date,
      end_date,
      days,
      reason,
      status,
      applied_date,
      manager
    ]);

    res.status(201).json({ message: 'Leave request created successfully' });
  } catch (error) {
    console.error('Error creating leave request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

