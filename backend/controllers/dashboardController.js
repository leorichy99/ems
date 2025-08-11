import { db } from '../db/connection.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [totalEmployees] = await db.query('SELECT COUNT(*) as count FROM users');
    const [presentToday] = await db.query('SELECT COUNT(*) as count FROM attendance WHERE  status = "Present"');
    const [onLeave] = await db.query('SELECT COUNT(*) as count FROM exit_requests WHERE status = "Approved" ');
    const [newHires] = await db.query('SELECT COUNT(*) as count FROM candidates WHERE status="Applied"');

    res.json({
      totalEmployees: totalEmployees[0].count,
      presentToday: presentToday[0].count,
      onLeave: onLeave[0].count,
      newHires: newHires[0].count
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};
