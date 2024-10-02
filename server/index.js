const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');   // client-server port connection
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');// Import student(members) routes
const noticeRoutes = require('./routes/noticeRoutes');// Import notice routes
const studentRoutes = require('./routes/studentRoutes');// Import student routes
const emailRoutes = require('./routes/emailRoutes'); // Import email routes
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
const port = process.env.PORT || 8080;

// Database connection
const connectDB = require('./config/db');
connectDB();

app.use(cors());
app.use(bodyParser.json());

// Middleware
app.use(express.json()); // To parse JSON data

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/students', studentRoutes);

// Use email routes
app.use('/api', emailRoutes);

// Use admin routes
app.use('/adm', adminRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
