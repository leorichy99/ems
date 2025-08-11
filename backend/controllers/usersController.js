import { db } from '../db/connection.js';

export const getUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Database query failed' });
  }
};



export const addUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    res.status(201).json({ id: result.insertId, name, email });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Database insert failed' });
  }
};
