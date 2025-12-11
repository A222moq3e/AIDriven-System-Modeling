import mongoose from '../db/index.js';

const connectDB = async () => {
  try {
    // Mongoose connection is handled in db/index.js
    // Wait for connection if not ready
    if (mongoose.connection.readyState === 1) {
      return; // Already connected
    }
    
    await new Promise((resolve, reject) => {
      if (mongoose.connection.readyState === 1) {
        resolve();
      } else {
        mongoose.connection.once('connected', resolve);
        mongoose.connection.once('error', reject);
        // Timeout after 10 seconds
        setTimeout(() => reject(new Error('Connection timeout')), 10000);
      }
    });
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
