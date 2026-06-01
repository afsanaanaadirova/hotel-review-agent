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

  const response = await client.messages.create({
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
  const parsed = JSON.parse(cleanText);

  return {
    sentiment: parsed.sentiment,
    summary: parsed.summary,
    issues: parsed.issues,
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
    processingTimeMs,
  };
}