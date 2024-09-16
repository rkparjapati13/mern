const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  console.log("Authorization:", authHeader)

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add the user info to the request object
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;