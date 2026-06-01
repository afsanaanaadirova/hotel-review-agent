'use client';

import { useState, useCallback } from 'react';
import { Sentiment } from '../types';
import { useReviews } from '../hooks/useReviews';
import StatsBar from '../components/StatsBar';
import FilterBar from '../components/FilterBar';
import ReviewCard from '../components/ReviewCard';
import AddReviewForm from '../components/AddReviewForm';

export default function Home() {
  const [filter, setFilter] = useState<Sentiment>('');
  const { reviews, stats, loading, error, refetch } = useReviews(filter);

  const handleAdded = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Hotel Review AI Dashboard
      </h1>

      <AddReviewForm onAdded={handleAdded} />

      {stats && <StatsBar stats={stats} />}

      <FilterBar filter={filter} onChange={setFilter} />

      {loading && <div className="text-gray-500">Yüklənir...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {!loading && !error && (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </main>
  );
}