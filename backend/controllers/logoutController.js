const jwt = require('jsonwebtoken');
const dbPromise = require('../config/db'); 

const logoutUser = async (req, res) => {
  try {
    
    const token = req.cookies.token;

    
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });


    if (token) {
      const db = await dbPromise;
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const expiresAt = new Date(decoded.exp * 1000);

        await db.query(
          'INSERT INTO token_blacklist (token, expires_at) VALUES (?, ?)',
          [token, expiresAt]
        );
        console.log('Token successfully blacklisted.'); 
      } catch (jwtError) {
     
        console.warn('Attempted to blacklist an invalid or expired token:', jwtError.message);
      }
    } else {
      console.log('No token found in request to blacklist (cookie likely already cleared or never existed).'); 
    }

    return res.status(200).json({
      message: 'Logout successful',
      success: true
    });

  } catch (err) {
    console.error('Logout error:', err);
  
    return res.status(500).json({
      message: 'Server error during logout',
      success: false
    });
  }
};

module.exports = { logoutUser };