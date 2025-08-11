import { db } from '../db/connection.js';

// Fetch attendance by date
export const getAttendance = async (req, res) => {
  const { date } = req.query;
  try {
    const [rows] = await db.query(
      `SELECT a.id, u.name, a.check_in, a.check_out,
              TIMEDIFF(a.check_out, a.check_in) AS hours, a.status
       FROM attendance a
       JOIN users u ON a.user_id = u.id
       WHERE a.date = ?`,
      [date]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching attendance' });
  }
};

// Add new attendance
export const addAttendance = async (req, res) => {
  const { user_id, date, check_in, check_out, status } = req.body;
  try {
    await db.query(
      `INSERT INTO attendance (user_id, date, check_in, check_out, status)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, date, check_in, check_out, status]
    );
    res.json({ message: 'Attendance added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding attendance' });
  }
};
