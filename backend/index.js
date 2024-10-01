require('dotenv-flow').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const http = require('http');
const socketIo = require('socket.io');


const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());

app.use(express.json());
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//       origin: '*', // React app's URL
//       methods: ['GET', 'POST']
//       // credentials: true
//   }
// });
// app.get('/', (req, res) => {
//   res.send('Socket.io server is running.');
// });
app.use('/api', authRoutes);  
// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/messages', messageRoutes);


// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);
//   socket.on('new_post', (post) => {
//       // Broadcast the new post to all connected clients
//       io.emit('receive_post', post);
//   });

//   // Listen for new comments
//   socket.on('new_comment', (comment) => {
//       // Broadcast the new comment to all connected clients
//       io.emit('receive_comment', comment);
//   });
//   socket.on('message', (data) => {
//     // console.log('datatta', data);
//       io.emit('message', data);
//   });
//   socket.on('disconnect', () => {
//       console.log('User disconnected:', socket.id);
//   });
  
// });
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});