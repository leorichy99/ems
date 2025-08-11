import { db } from '../db/connection.js';

// Get all leave requests (optionally filtered by status)
export async function getLeaveRequests(req, res) {
  try {
    const { status } = req.query;

    let query = 'SELECT * FROM leave_requests';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status.charAt(0).toUpperCase() + status.slice(1).toLowerCase());
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

// Get single leave request by id
export async function getLeaveRequestById(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM leave_requests WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

// Create a new leave request
export async function createLeaveRequest(req, res) {
  try {
    const {
      employee_name,
      employee_id,
      type,
      start_date,
      end_date,
      days,
      reason,
      applied_date,
      manager
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO leave_requests 
      (employee_name, employee_id, type, start_date, end_date, days, reason, status, applied_date, manager) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?)`,
      [employee_name, employee_id, type, start_date, end_date, days, reason, applied_date, manager]
    );

    res.status(201).json({ id: result.insertId, message: 'Leave request created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

// Approve leave request
export async function approveLeaveRequest(req, res) {
  try {
    const { id } = req.params;
    const [result] = await db.query(
      'UPDATE leave_requests SET status = ? WHERE id = ?',
      ['Approved', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    res.json({ message: 'Leave request approved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

// Reject leave request
export async function rejectLeaveRequest(req, res) {
  try {
    const { id } = req.params;
    const { rejection_reason } = req.body;

    if (!rejection_reason) {
      return res.status(400).json({ error: 'Rejection reason required' });
    }

    const [result] = await db.query(
      'UPDATE leave_requests SET status = ?, rejection_reason = ? WHERE id = ?',
      ['Rejected', rejection_reason, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    res.json({ message: 'Leave request rejected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}
