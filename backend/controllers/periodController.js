// controllers/periodController.js
import { db } from '../db/connection.js';

export const getPeriods = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT id, period_label FROM performance_periods ORDER BY start_date DESC`);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching periods:', err);
    res.status(500).json({ message: 'Failed to fetch review periods' });
  }
};



