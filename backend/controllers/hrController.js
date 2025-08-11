import { db } from '../db/connection.js';

// Get HR statistics
export const getHRStats = (req, res) => {
  const query = `
    SELECT 
      COUNT(*) AS totalEmployees,
      SUM(CASE WHEN status='Active' THEN 1 ELSE 0 END) AS activeEmployees,
      SUM(CASE WHEN status='On Leave' THEN 1 ELSE 0 END) AS onLeave,
      SUM(CASE WHEN status='Inactive' THEN 1 ELSE 0 END) AS inactiveEmployees
    FROM users
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
};

// Get Department Overview
export const getDepartmentOverview = (req, res) => {
  const query = `
    SELECT 
      department, 
      COUNT(*) AS employees,
      SUM(CASE WHEN position LIKE '%Manager%' THEN 1 ELSE 0 END) AS managers,
      SUM(CASE WHEN role='Admin' THEN 1 ELSE 0 END) AS admins
    FROM users
    GROUP BY department
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
