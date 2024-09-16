require('dotenv-flow').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const oauthMiddleware = require('./middleware/oauthMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Protected API routes
app.use('/api/users', oauthMiddleware, userRoutes);
app.use('/api/posts', oauthMiddleware, postRoutes);
app.use('/api/comments', oauthMiddleware, commentRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
