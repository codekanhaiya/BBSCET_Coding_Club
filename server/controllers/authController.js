const Student = require('../models/studentModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/authMiddleware');

// Register a new student
const registerStudent = async (req, res) => {
  const { firstName, lastName, email, course, subField, year, rollNumber, gender, password } = req.body;

  try {
    // Check if the email or rollNumber is already registered
    const existingStudent = await Student.findOne({
      $or: [{ email }, { rollNumber }]
    });

    if (existingStudent) {
      return res.status(400).json({ message: 'Student already registered with this email or roll number!' });
    }

    const userModel = new Student({ firstName, lastName, email, course, subField, year, rollNumber, gender, password });
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();

    res.status(201).json({ message: "Registered Successfully", success: true });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Login a student
const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the student exists
    const student = await Student.findOne({ email });
    if (!student) return res.status(401).json({ message: 'Incorrect email.' });

    // Validate password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password.' });

    // Generate JWT token
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send success response with token
    res.status(200).json({ message: "Login successful", success: true, token });
  } catch (err) {
    // Handle any server errors
    res.status(500).json({ message: "Internal server error", success: false });
  }
};


// Logout function to invalidate the token on the client-side
const logoutStudent = (req, res) => {
  // Clear the token (client should handle it by removing the token from storage)
  res.status(200).json({ message: 'Logout successful', success: true });
};

// Fetching data from the database
const dashStudent = async (req, res) => {
  try {
    // The user information is already attached to req.user by the verifyToken middleware
    const userId = req.user.id; // Assuming the user ID is stored in the token payload

    // Fetch the student data from the database
    const student = await Student.findById(userId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Send back the student data
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student data', error });
  }
};

// Reset the password of student
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Validate the input (you might want to add more validation here)
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required.', success: false });
    }

    // Find the student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: 'Email not found.', success: false });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the student's password using the update method
    await Student.updateOne({ email }, { password: hashedPassword });

    // Send success response
    res.status(200).json({ message: 'Password reset successfully.', success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};


module.exports = { registerStudent, loginStudent, logoutStudent, dashStudent, resetPassword};
