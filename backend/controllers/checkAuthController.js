const jwt = require('jsonwebtoken');

const checkAuth = (req, res) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Authentication failed: No token provided' 
      });
    } 

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
 
    res.status(200).json({
      message: 'User is authenticated',
      user: {
        id: decoded.id,
        email: decoded.email
      
      }
    });

  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      message: 'Authentication failed: Invalid token' 
    });
  }
};

module.exports = { checkAuth };