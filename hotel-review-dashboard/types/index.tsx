export interface Review {
  id: number;
  hotel_name: string;
  review_text: string;
  rating: number;
  created_at: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  summary: string;
  issues: string[];
  tokens_used: number;
  processing_time_ms: number;
}

export interface Stats {
  total_reviews: string;
  avg_processing_ms: string;
  total_tokens: string;
  positive_count: string;
  negative_count: string;
  neutral_count: string;
}

export type Sentiment = 'positive' | 'negative' | 'neutral' | '';