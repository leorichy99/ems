import { db } from '../db/connection.js';
export const getCandidates = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM candidates');
  res.json(rows);
};

export const reviewCandidate = async (req, res) => {
  const { id } = req.params;
  const { review_status, review_feedback } = req.body;

  try {
    await db.query(
      'UPDATE candidates SET review_status = ?, review_feedback = ? WHERE id = ?',
      [review_status, review_feedback, id]
    );
    res.status(200).json({ message: 'Candidate reviewed successfully' });
  } catch (err) {
    console.error('Error reviewing candidate:', err);
    res.status(500).json({ message: 'Failed to review candidate' });
  }
};