import { db } from '../db/connection.js';

export const getPayroll = async (req, res) => {
  try {
const [rows] = await db.query(`
  SELECT 
    p.id AS payroll_id,
    u.id AS user_id, u.name, u.position,
    p.basic_salary, p.allowances, p.deductions,
    (p.basic_salary + p.allowances - p.deductions) AS net_salary,
    p.status
  FROM payroll p
  JOIN users u ON p.user_id = u.id
`);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch payroll data' });
  }
};

export const updatePayrollStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "UPDATE payroll SET status = 'Paid' WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    res.json({ message: "Payroll marked as paid" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update payroll status" });
  }
};
