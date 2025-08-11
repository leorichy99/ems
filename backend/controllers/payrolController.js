import { db } from "../db/connection.js";

export const getPayrollByUser = async (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT id, user_id, month, basic_salary, allowances, deductions, status 
    FROM payroll WHERE user_id = ? ORDER BY month DESC
  `;

  try {
    const [results] = await db.query(query, [userId]); // mysql2/promise returns [rows, fields]
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
};
