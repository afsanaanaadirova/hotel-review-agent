import express from 'express';
import { pool } from './database';
import { analyzeReview } from './agent';

export const router = express.Router();

//Add a new review and analyze it with Claude
router.post('/reviews', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { hotel_name, review_text, rating } = req.body;

    // Validation
    if (!hotel_name || !review_text || !rating) {
      return res.status(400).json({
        error: 'hotel_name, review_text and rating are required'
      });
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'rating must be a number between 1 and 5'
      });
    }

    const reviewResult = await client.query(
      `INSERT INTO reviews (hotel_name, review_text, rating) 
       VALUES ($1, $2, $3) RETURNING *`,
      [hotel_name, review_text, rating]
    );
    const review = reviewResult.rows[0];

    const analysis = await analyzeReview(review_text);

    await client.query(
      `INSERT INTO analysis 
        (review_id, sentiment, summary, issues, tokens_used, processing_time_ms)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [review.id, analysis.sentiment, analysis.summary,
      analysis.issues, analysis.tokensUsed, analysis.processingTimeMs]
    );

    await client.query('COMMIT');
    res.json({ review, analysis });

  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: String(error) });
  } finally {
    client.release();
  }
});

//Fetch all reviews along with their analysis
router.get('/reviews', async (req, res) => {
  try {
    const { sentiment } = req.query;

    let query = `
      SELECT 
        r.id, r.hotel_name, r.review_text, r.rating, r.created_at,
        a.sentiment, a.summary, a.issues, a.tokens_used, a.processing_time_ms
      FROM reviews r
      LEFT JOIN analysis a ON a.review_id = r.id
    `;

    const params: string[] = [];

    if (sentiment) {
      query += ` WHERE a.sentiment = $1`;
      params.push(sentiment as string);
    }

    query += ` ORDER BY r.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

//Statistics - token cost and performance
router.get('/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_reviews,
        AVG(processing_time_ms) as avg_processing_ms,
        SUM(tokens_used) as total_tokens,
        COUNT(CASE WHEN sentiment = 'positive' THEN 1 END) as positive_count,
        COUNT(CASE WHEN sentiment = 'negative' THEN 1 END) as negative_count,
        COUNT(CASE WHEN sentiment = 'neutral' THEN 1 END) as neutral_count
      FROM reviews r
      LEFT JOIN analysis a ON a.review_id = r.id
    `);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});