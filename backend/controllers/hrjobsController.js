import { db } from "../db/connection.js"; // your MySQL connection

// Get all open jobs
export const getJobs = (req, res) => {
  const sql = 'SELECT * FROM job_openings WHERE status = "Open" ORDER BY posted_at DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Create a new job opening
export const createJob = (req, res) => {
  const {
    title,
    department,
    description,
    requirements,
    location,
    employment_type,
  } = req.body;

  const sql = `INSERT INTO job_openings 
    (title, department, description, requirements, location, employment_type, status, posted_at) 
    VALUES (?, ?, ?, ?, ?, ?, 'Open', NOW())`;

  db.query(
    sql,
    [title, department, description, requirements, location, employment_type],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: 'Job posted successfully' });
    }
  );
};
