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
        // Set up timeout and store the timeout ID
        const timeoutId = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 10000);
        
        // Clear timeout and resolve when connected
        mongoose.connection.once('connected', () => {
          clearTimeout(timeoutId);
          resolve();
        });
        
        // Clear timeout and reject on error
        mongoose.connection.once('error', (error) => {
          clearTimeout(timeoutId);
          reject(error);
        });
      }
    });
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
