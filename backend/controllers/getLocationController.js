const dbPromise = require('../config/db');

const getUserLocations = async (req, res) => {
  const userId = req.user.userId;

  try {
    const db = await dbPromise;
    const [locations] = await db.query('SELECT * FROM locations WHERE user_id = ?', [userId]);
    return res.status(200).json({ locations });
  } catch (err) {
    console.error('Get locations error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserLocations };
