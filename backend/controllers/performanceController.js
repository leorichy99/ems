import { db } from '../db/connection.js';

export const getPerformance = async (req, res) => {
  try {


const { period_id } = req.query;

const [rows] = await db.query(`
  SELECT 
    pr.id,
    u.id AS user_id,
    u.name,
    u.position,
    pp.period_label,
    pp.start_date,
    pp.end_date,
    pr.goals,
    pr.goals_completed,
    pr.rating,
    pr.status,
    pr.feedback,
    pr.reviewed_by,
    pr.reviewed_at
  FROM performance_reviews pr
  JOIN users u ON pr.user_id = u.id
  JOIN performance_periods pp ON pr.period_id = pp.id
  WHERE pr.period_id = ?
`, [period_id]);


    res.json(rows);
  } catch (err) {
    console.error('Error fetching performance data:', err);
    res.status(500).json({ message: 'Failed to fetch performance data' });
  }
};



export const addPerformance = async (req, res) => {
  try {
    const {
      user_id,
      period_id,
      goals,
      goals_completed,
      rating,
      status,
      feedback,
      reviewed_by
    } = req.body;

    const reviewed_at = new Date(); // current timestamp

    const [result] = await db.query(`
      INSERT INTO performance_reviews 
        (user_id, period_id, goals, goals_completed, rating, status, feedback, reviewed_by, reviewed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [user_id, period_id, goals, goals_completed, rating, status, feedback, reviewed_by, reviewed_at]);

    res.status(201).json({ message: 'Performance review added successfully', id: result.insertId });
  } catch (error) {
    console.error('Error adding performance review:', error);
    res.status(500).json({ message: 'Failed to add performance review' });
  }
};
