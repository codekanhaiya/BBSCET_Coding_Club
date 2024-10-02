const express = require('express');
const { registerStudent, loginStudent, logoutStudent, dashStudent, resetPassword } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Student registration route
router.post('/register', registerStudent);

// Student login route
router.post('/login', loginStudent);

// Student logout route
router.post('/logout', verifyToken, logoutStudent);

// Student dashboard route
router.get('/members',verifyToken, dashStudent);

// Student reset password route
router.post('/reset-password', resetPassword);

module.exports = router;
