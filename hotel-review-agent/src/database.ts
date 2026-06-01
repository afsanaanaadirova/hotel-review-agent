import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      hotel_name VARCHAR(255) NOT NULL,
      review_text TEXT NOT NULL,
      rating INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS analysis (
      id SERIAL PRIMARY KEY,
      review_id INTEGER REFERENCES reviews(id),
      sentiment VARCHAR(50),
      summary TEXT,
      issues TEXT[],
      tokens_used INTEGER,
      processing_time_ms INTEGER,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log('Database initialized');
}