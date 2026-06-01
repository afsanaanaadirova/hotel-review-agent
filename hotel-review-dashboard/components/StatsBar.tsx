import { Stats } from '../types';

interface Props {
  stats: Stats;
}

export default function StatsBar({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="text-2xl font-bold text-gray-800">{stats.total_reviews}</div>
        <div className="text-sm text-gray-500">Total Reviews</div>
      </div>
      <div className="bg-green-50 rounded-xl p-4 shadow-sm">
        <div className="text-2xl font-bold text-green-600">{stats.positive_count}</div>
        <div className="text-sm text-gray-500">Positive</div>
      </div>
      <div className="bg-red-50 rounded-xl p-4 shadow-sm">
        <div className="text-2xl font-bold text-red-600">{stats.negative_count}</div>
        <div className="text-sm text-gray-500">Negative</div>
      </div>
      <div className="bg-blue-50 rounded-xl p-4 shadow-sm">
        <div className="text-2xl font-bold text-blue-600">
          {Math.round(Number(stats.avg_processing_ms))}ms
        </div>
        <div className="text-sm text-gray-500">Avg Processing</div>
      </div>
    </div>
  );
}