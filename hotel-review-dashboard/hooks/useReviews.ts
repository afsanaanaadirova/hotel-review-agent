import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Review, Stats, Sentiment } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export function useReviews(filter: Sentiment) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = filter
        ? `${API_URL}/reviews?sentiment=${filter}`
        : `${API_URL}/reviews`;

      const [reviewsRes, statsRes] = await Promise.all([
        axios.get(url),
        axios.get(`${API_URL}/stats`),
      ]);

      setReviews(reviewsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError('Məlumatlar yüklənmədi');
    } finally {
      setLoading(false);
    }
  }, [filter, trigger]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    setTrigger((t) => t + 1);
  }, []);

  return { reviews, stats, loading, error, refetch };
}