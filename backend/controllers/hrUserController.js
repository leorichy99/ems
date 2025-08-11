
import { db } from "../db/connection.js"; // your MySQL connection

export const addEmployee = async (req, res) => {
  const { name, position, department, status, email, password, role } = req.body;

  if (!name || !position || !department || !status || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const sql = `
      INSERT INTO users (name, position, department, status, email, password, role, changePass)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `;

    await db.query(sql, [name, position, department, status, email, password, role]);

    res.json({ message: "Employee added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};
