const Notice = require('../models/noticeModel');

// Fetch all notices
const fetchNotices = async (req, res) => {
  try {
    const notices = await Notice.find();
    res.status(200).json(notices);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add a new notice
const addNotice = async (req, res) => {
  const { message } = req.body;

  try {
    const newNotice = new Notice({ message });
    await newNotice.save();
    res.status(201).json(newNotice);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a notice by ID
const deleteNotice = async (req, res) => {
  const { id } = req.params;

  try {
    const notice = await Notice.findByIdAndDelete(id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }
    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { fetchNotices, addNotice, deleteNotice };
