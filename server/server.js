const authRoutes = require('./routes/auth.js');
// server/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const resourceRoutes = require("./routes/resource");
const notificationRoutes = require('./routes/notification');
const auth = require('./middleware/auth.js');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use("/api/resources", resourceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/uploads', express.static('uploads'));

// Stats endpoint
app.get('/api/stats', auth, async (req, res) => {
  try {
    const Resource = require('./models/Resource');
    const User = require('./models/User');
    
    const totalResources = await Resource.countDocuments();
    const activeStudents = await User.countDocuments();
    const branches = 6; // Hardcoded for now
    const subjects = await Resource.distinct('subject').length;

    res.json({
      totalResources,
      activeStudents,
      branches,
      subjects
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://studyhub_user:StudyHub123@cluster0.j9nvm9u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected ✅'))
  .catch(err => console.log('MongoDB connection error ❌', err));

  

app.listen(PORT, () => {
  console.log(`running on http://localhost:${PORT} `);
});
