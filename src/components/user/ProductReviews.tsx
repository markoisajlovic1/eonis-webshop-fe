import React from 'react';
import { FaStar } from 'react-icons/fa';

const RATING_DISTRIBUTION = [
  { stars: 5, count: 184 },
  { stars: 4, count: 97 },
  { stars: 3, count: 32 },
  { stars: 2, count: 14 },
  { stars: 1, count: 9 },
];

const CATEGORY_RATINGS = [
  { label: 'Performanse', score: 4.7 },
  { label: 'Kvalitet', score: 4.5 },
  { label: 'Dizajn', score: 4.3 },
];

const total = RATING_DISTRIBUTION.reduce((sum, r) => sum + r.count, 0);
const average =
  RATING_DISTRIBUTION.reduce((sum, r) => sum + r.stars * r.count, 0) / total;

const Stars: React.FC<{ value: number; small?: boolean }> = ({ value, small }) => (
  <div className={`flex gap-0.5 ${small ? 'text-xs' : 'text-sm'}`}>
    {[1, 2, 3, 4, 5].map((s) => (
      <FaStar
        key={s}
        className={s <= Math.round(value) ? 'text-yellow-400' : 'text-neutral-200'}
      />
    ))}
  </div>
);

const ProductReviews: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-xs p-6">
      <h2 className="text-base font-bold text-neutral-900 mb-5">Ocene korisnika</h2>

      <div className="flex gap-10">
        {/* Left: average + bar chart */}
        <div className="flex flex-col items-center gap-1 min-w-[90px]">
          <span className="text-5xl font-extrabold text-neutral-900 leading-none">
            {average.toFixed(1)}
          </span>
          <Stars value={average} />
          <span className="text-xs text-neutral-400 mt-1">{total} ocena</span>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          {RATING_DISTRIBUTION.map(({ stars, count }) => {
            const pct = Math.round((count / total) * 100);
            return (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-xs text-neutral-500 w-5 text-right">{stars}</span>
                <FaStar className="text-yellow-400 text-xs shrink-0" />
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-neutral-400 w-7 text-right">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Right: category scores */}
        <div className="flex flex-col gap-4 min-w-[130px]">
          {CATEGORY_RATINGS.map(({ label, score }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-xs text-neutral-500 font-medium">{label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-neutral-800">{score.toFixed(1)}</span>
                <Stars value={score} small />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
