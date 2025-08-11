import { db } from "../db/connection.js";

// Get profile by user ID
export const getProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const query = `SELECT 
      id,
      name,
      position,
      department,
      status,
      email,
      role
      FROM users WHERE id = ?`;

    const [rows] = await db.execute(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // You can split 'name' into firstName and lastName on frontend if needed,
    // or just send 'name' as is.
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile by user ID
export const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const {
    name,
    position,
    department,
    status,
    email,
    role,
  } = req.body;

  try {
    const query = `
      UPDATE users SET
        name = ?,
        position = ?,
        department = ?,
        status = ?,
        email = ?,
        role = ?
      WHERE id = ?`;

    const params = [
      name,
      position,
      department,
      status,
      email,
      role,
      userId,
    ];

    const [result] = await db.execute(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
