import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import kbRoutes from './routes/kbRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

// Import middleware
import { errorHandler } from './middleware/auth.js';

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/kb', kbRoutes);
app.use('/analytics', analyticsRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Database connection and server start
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log('📚 API Routes:');
      console.log('   POST   /auth/register');
      console.log('   POST   /auth/login');
      console.log('   POST   /auth/logout');
      console.log('   POST   /chat/send-message');
      console.log('   GET    /chat/history/:chatId');
      console.log('   GET    /chat/all');
      console.log('   POST   /chat/create');
      console.log('   DELETE /chat/:chatId');
      console.log('   POST   /kb/upload');
      console.log('   GET    /kb/search');
      console.log('   GET    /kb/all');
      console.log('   DELETE /kb/:docId');
      console.log('   GET    /analytics/summary');
      console.log('   GET    /analytics/detailed');
    });
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

connectDB();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n📴 Shutting down gracefully...');
  mongoose.connection.close();
  process.exit(0);
});

export default app;
