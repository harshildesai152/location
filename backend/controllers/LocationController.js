const dbPromise = require('../config/db');

const addLocation = async (req, res) => {
  const { name, latitude, longitude } = req.body;
  const userId = req.user.userId; 

  if (!name || !latitude || !longitude) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const db = await dbPromise;
    await db.query(
      'INSERT INTO locations (user_id, name, latitude, longitude) VALUES (?, ?, ?, ?)',
      [userId, name, latitude, longitude]
    );

    return res.status(201).json({ message: 'Location added successfully' });
  } catch (err) {
    console.error('Add location error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addLocation };


