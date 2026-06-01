import { Sentiment } from '../types';

interface Props {
  filter: Sentiment;
  onChange: (value: Sentiment) => void;
}

const FILTERS: { label: string; value: Sentiment }[] = [
  { label: 'All', value: '' },
  { label: 'Positive', value: 'positive' },
  { label: 'Negative', value: 'negative' },
  { label: 'Neutral', value: 'neutral' },
];

export default function FilterBar({ filter, onChange }: Props) {
  return (
    <div className="flex gap-3 mb-6">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === f.value
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}