// Import jsonwebtoken
const jwt = require('jsonwebtoken');

// Define the verifyToken function
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Verify token using the secret key
    req.user = verified; // Store user info in req object
    next(); // Proceed to the next middleware
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken; // Export the function
