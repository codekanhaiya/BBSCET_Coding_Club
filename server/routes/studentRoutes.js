const express = require('express');
const { getAllStudents, deleteStudent } = require('../controllers/studentController');

const router = express.Router();

// GET /api/students
router.get('/', getAllStudents);

// DELETE /api/students/:id
router.delete('/:id', deleteStudent);

module.exports = router;
