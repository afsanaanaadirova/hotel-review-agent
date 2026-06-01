import { Review } from '../types';

interface Props {
    review: Review;
}

const sentimentStyles = {
    positive: 'bg-green-100 text-green-700',
    negative: 'bg-red-100 text-red-700',
    neutral: 'bg-gray-100 text-gray-700',
};

export default function ReviewCard({ review }: Props) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        {review.hotel_name}
                    </h2>
                    <div className="text-yellow-500 text-sm">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${sentimentStyles[review.sentiment]}`}>
                    {review.sentiment}
                </span>
            </div>

            <p className="text-gray-600 text-sm mb-3">{review.review_text}</p>

            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="text-xs font-medium text-gray-500 mb-1">AI Summary</div>
                <div className="text-sm text-gray-700">{review.summary}</div>
            </div>

            {review.issues?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {review.issues.map((issue, i) => (
                        <span key={i} className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full">
                            {issue}
                        </span>
                    ))}
                </div>
            )}

            <div className="text-xs text-gray-400">
                {review.tokens_used} token · {review.processing_time_ms}ms
            </div>
        </div>
    );
}