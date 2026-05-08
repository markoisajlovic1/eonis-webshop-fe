import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { reviewService } from '../../services/reviewService';
import type { ProductReviewAveragesDTO } from '../../types/review';

interface ProductReviewsProps {
  productId: string;
}

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

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [averages, setAverages] = useState<ProductReviewAveragesDTO | null>(null);

  useEffect(() => {
    reviewService.getAverages(productId).then(setAverages).catch(console.error);
    console.log(averages)
  }, [productId]);

  if (!averages) return null;

  const categoryRatings = [
    { label: 'Performanse', score: averages.performanceGrade, counts: averages.performanceCounts },
    { label: 'Kvalitet', score: averages.qualityGrade, counts: averages.qualityCounts },
    { label: 'Dizajn', score: averages.designGrade, counts: averages.designCounts },
  ];

  const allCounts = [averages.performanceCounts, averages.qualityCounts, averages.designCounts];

  const totalVotes = allCounts.reduce(
    (sum, counts) => sum + Object.values(counts).reduce((s, v) => s + v, 0),
    0
  );

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: allCounts.reduce((sum, counts) => sum + (counts[String(stars)] ?? 0), 0),
  }));

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-xs p-6">
      <h2 className="text-base font-bold text-neutral-900 mb-5">Ocene korisnika</h2>

      <div className="flex gap-10">
        <div className="flex flex-col items-center gap-1 min-w-[90px]">
          <span className="text-5xl font-extrabold text-neutral-900 leading-none">
            {averages.totalGrade.toFixed(1)}
          </span>
          <Stars value={averages.totalGrade} />
          <span className="text-xs text-neutral-400 mt-1">{Math.round(totalVotes / 3)} ocena</span>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          {ratingDistribution.map(({ stars, count }) => {
            const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
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

        <div className="flex flex-col gap-4 min-w-[130px]">
          {categoryRatings.map(({ label, score }) => (
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
