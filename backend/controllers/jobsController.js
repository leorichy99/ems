import { db } from "../db/connection.js";
export const getJobs = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM job_openings");
  res.json(rows);
};

// POST new job
export const createJob = async (req, res) => {
  const {
    title,
    description,
    requirements,
    department,
    location,
    status,
    employment_type,
  } = req.body;
  try {
    await db.query(
      `INSERT INTO job_openings 
        (title, description, requirements, department, location, status, employment_type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        requirements,
        department,
        location,
        status,
        employment_type,
      ]
    );
    res.status(201).json({ message: "Job created successfully" });
  } catch (err) {
    console.error("Error inserting job:", err);
    res.status(500).json({ message: "Failed to create job" });
  }
};

export const updateJob = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    requirements,
    department,
    location,
    employment_type,
    status,
  } = req.body;
  try {
    await db.query(
      `UPDATE job_openings 
       SET title=?, description=?, requirements=?, department=?, location=?, employment_type=?, status=? 
       WHERE id=?`,
      [
        title,
        description,
        requirements,
        department,
        location,
        employment_type,
        status,
        id,
      ]
    );
    res.json({ message: "Job updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating job" });
  }
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM job_openings WHERE id=?", [id]);
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting job" });
  }
};
