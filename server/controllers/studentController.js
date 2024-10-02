const Student = require('../models/studentModel');

// Fetch all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students.' });
  }
};

// Delete a student by ID
exports.deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    await Student.findByIdAndDelete(studentId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student.' });
  }
};
