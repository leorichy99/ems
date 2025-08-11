import { db } from "../db/connection.js"; // your MySQL connection
// Create Exit Request

export const createExitRequest = async (req, res) => {
  const { user_id, position, department, last_working_day, reason, status } =
    req.body;
  try {
    await db.query(
      `INSERT INTO exit_requests (user_id, position, department, last_working_day, reason, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, position, department, last_working_day, reason, status]
    );
    res.status(201).json({ message: "Exit request submitted" });
  } catch (error) {
    console.error("Error creating exit request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Exit Requests
export const getExitRequests = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT er.*, u.name 
      FROM exit_requests er 
      JOIN users u ON u.id = er.user_id
    `);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching exit requests:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const approveExitRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      'UPDATE exit_requests SET status = ? WHERE id = ?',
      ['Approved', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Exit request not found' });
    }

    res.json({ message: 'Exit request approved successfully' });
  } catch (err) {
    console.error('Error approving exit request:', err);
    res.status(500).json({ message: 'Error approving exit request' });
  }
};
