'use client';

import { useState } from 'react';
import axios from 'axios';

interface Props {
  onAdded: () => void;
}

export default function AddReviewForm({ onAdded }: Props) {
  const [hotelName, setHotelName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!hotelName || !reviewText || rating === 0) {
      setError('Please fill in all fields!');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        hotel_name: hotelName,
        review_text: reviewText,
        rating,
      });
      setHotelName('');
      setReviewText('');
      setRating(0);
      onAdded();
    } catch (err) {
      setError('Something went wrong, please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Review</h2>

      <div className="grid gap-4">
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Hotel Name *</label>
          <input
            type="text"
            value={hotelName}
            onChange={(e) => {
              setHotelName(e.target.value);
              setError('');
            }}
            placeholder="e.g. Hilton Dusseldorf"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Review *</label>
          <textarea
            value={reviewText}
            onChange={(e) => {
              setReviewText(e.target.value);
              setError('');
            }}
            placeholder="Write your review about the hotel..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Rating *</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => {
                  setRating(star);
                  setError('');
                }}
                className={`text-2xl transition-colors ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-200'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-gray-800 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'AI is analyzing...' : 'Add Review'}
        </button>
      </div>
    </div>
  );
}