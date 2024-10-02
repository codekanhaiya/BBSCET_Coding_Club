const express = require('express');
const { fetchNotices, addNotice, deleteNotice } = require('../controllers/noticeController');

const router = express.Router();

// Define routes for notices
router.get('/', fetchNotices);
router.post('/', addNotice);
router.delete('/:id', deleteNotice);

module.exports = router;
