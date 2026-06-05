import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  summary: string;
  issues: string[];
  tokensUsed: number;
  processingTimeMs: number;
}


export async function analyzeReview(reviewText: string): Promise<AnalysisResult> {
  const startTime = Date.now();
  const maxAttempts = 3;
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      let response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Analyze this hotel review and respond ONLY with a JSON object, no extra text:

Review: "${reviewText}"

{
  "sentiment": "positive" or "negative" or "neutral",
  "summary": "one sentence summary",
  "issues": ["issue1", "issue2"]
}`,
          },
        ],
      });
      const processingTimeMs = Date.now() - startTime;
      const rawText = response.content[0].type === 'text' ? response.content[0].text : '';
      const cleanText = rawText.replace(/```json\n?|\n?```/g, '').trim();
      let parsed
      try {
        parsed = JSON.parse(cleanText);
      } catch (error) {
        return {
          sentiment: 'neutral',
          summary: 'Analysis unavailable',
          issues: [],
          tokensUsed: 0,
          processingTimeMs: Date.now() - startTime
        }
      }

      return {
        sentiment: parsed.sentiment,
        summary: parsed.summary,
        issues: parsed.issues,
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
        processingTimeMs,
      };
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        const waitMs = 1000 * attempt;
        await new Promise(r => setTimeout(r, waitMs));
      }
    }
  }

  throw new Error(`Claude API failed after ${maxAttempts} attempts: ${lastError!}`);
}