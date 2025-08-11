import { db } from '../db/connection.js'; // MySQL connection pool

// ✅ Get all employees
export const getEmployees = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, position, department, status FROM users'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ message: 'Error fetching employees' });
  }
};

// ✅ Add new employee
export const addEmployee = async (req, res) => {
  const { name, email, position, department, status } = req.body;
  try {
    await db.query(
      `INSERT INTO users (name, email, position, department, status, password) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, position, department, status, '123'] // Default password
    );
    res.status(201).json({ message: 'Employee added successfully' });
  } catch (err) {
    console.error('Error adding employee:', err);
    res.status(500).json({ message: 'Error adding employee' });
  }
};

// ✅ Update employee
export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, email, position, department, status } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE users 
       SET name = ?, email = ?, position = ?, department = ?, status = ? 
       WHERE id = ?`,
      [name, email, position, department, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee updated successfully' });
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ message: 'Error updating employee' });
  }
};


