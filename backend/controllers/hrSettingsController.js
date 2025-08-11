// backend/controllers/hrSettingsController.js
import { db } from "../db/connection.js"; // your MySQL connection

export const getSettings = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM hr_settings ORDER BY id LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    const settings = rows[0];
    res.json({
      companyName: settings.company_name,
      companyEmail: settings.company_email,
      companyPhone: settings.company_phone,
      companyAddress: settings.company_address,
      workingHours: settings.working_hours,
      timezone: settings.timezone,
      currency: settings.currency,
      dateFormat: settings.date_format
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const updateSettings = async (req, res) => {
  const {
    companyName,
    companyEmail,
    companyPhone,
    companyAddress,
    workingHours,
    timezone,
    currency,
    dateFormat
  } = req.body;

  try {
    // First get the id of the settings row
    const [rows] = await db.query('SELECT id FROM hr_settings ORDER BY id LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Settings not found to update' });
    }
    const id = rows[0].id;

    // Now update using the id
    const [result] = await db.query(
      `UPDATE hr_settings SET 
         company_name = ?,
         company_email = ?,
         company_phone = ?,
         company_address = ?,
         working_hours = ?,
         timezone = ?,
         currency = ?,
         date_format = ?,
         updated_at = NOW()
       WHERE id = ?`,
      [
        companyName,
        companyEmail,
        companyPhone,
        companyAddress,
        workingHours,
        timezone,
        currency,
        dateFormat,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Settings not found to update' });
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
};

