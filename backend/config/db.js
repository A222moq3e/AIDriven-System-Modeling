import { db } from '../db/index.js';
import { sql } from 'drizzle-orm';

const connectDB = async () => {
  try {
    // Test the connection by running a simple query
    await db.execute(sql`SELECT 1`);
    console.log('PostgreSQL Connected successfully');
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
