const bcrypt = require('bcrypt');
const dbPromise = require('../config/db'); // Adjust path as needed

const getsignupList = async (req, res) => {
  const { name, email, password } = req.body;

  // ✅ Input validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // ✅ Await the db connection
    const db = await dbPromise;

    // ✅ Check if email already exists
    const [existingUser] = await db.query('SELECT * FROM signup_data WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert new user
    const insertQuery = 'INSERT INTO signup_data (name, email, password) VALUES (?, ?, ?)';
    await db.query(insertQuery, [name, email, hashedPassword]);

    return res.status(201).json({ message: 'Signup successful' });

  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error', error: err });
  }
};

module.exports = { getsignupList };
