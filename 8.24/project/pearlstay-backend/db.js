import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MySQL configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'pearlstay',
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Initialize schema
const schemaPath = join(__dirname, '..', 'mysql-schema.sql');
if (fs.existsSync(schemaPath)) {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  const statements = schema.split(';').filter(stmt => stmt.trim());
  for (const stmt of statements) {
    if (stmt.trim()) {
      try {
        await pool.query(stmt);
      } catch (err) {
        // Ignore duplicate/exists errors
        if (!err.message.includes('already exists') && !err.message.includes('Duplicate')) {
          console.error('Schema error:', err.message);
        }
      }
    }
  }
}

// Helper function for querying
export const query = async (sql, params = []) => {
  try {
    const [rows] = await pool.query(sql, params);
    return [rows];
  } catch (error) {
    return Promise.reject(error);
  }
};

// Export the pool for direct use if needed
export default pool;