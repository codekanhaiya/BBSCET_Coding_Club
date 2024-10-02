// routes/email.js
const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

// Route to send email
router.post('/send-email', async (req, res) => {
  const { from, to, content } = req.body;

  // Check for missing fields
  if (!from || !to || !content) {
    return res.status(400).json({ message: 'All fields are required (from, to, content)' });
  }

  // Configure the email transport using Nodemailer
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kanhaiyaguptaksg@gmail.com', // Your Gmail address
      pass: 'oljjihdwenttetey' // Your Gmail app-specific password "Less secure app access"
    }
  });

  // Email options
  let mailOptions = {
    from: from, // Sender address
    to: to,     // Recipient email
    subject: 'Message from Admin', // Subject line
    text: content // Plain text body
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email.' });
  }
});

module.exports = router; // Export the router
