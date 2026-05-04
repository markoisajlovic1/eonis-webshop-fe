import { useState, useEffect, useCallback } from 'react'
import { FiChevronLeft, FiChevronRight, FiTrash2 } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import { reviewService } from '../../services/reviewService'
import type { ReviewDTO } from '../../types/review'

const PAGE_SIZE = 12

const fmtDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' })

const Stars = ({ value }: { value: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <FaStar key={s} size={13} className={s <= Math.round(value) ? 'text-yellow-400' : 'text-neutral-200'} />
    ))}
  </div>
)

const ReviewsPage = () => {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const [reviews, setReviews] = useState<ReviewDTO[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchPage = useCallback((p: number) => {
    if (!userId) return
    setLoading(true)
    reviewService.getByUserId(userId, { pageNumber: p, pageSize: PAGE_SIZE })
      .then(result => {
        setReviews(result.items)
        setTotalCount(result.totalCount)
        setTotalPages(Math.max(1, result.totalPages))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [userId])

  useEffect(() => {
    if (!userId) return
    fetchPage(page)
  }, [userId, page, fetchPage])

  const handleDelete = (reviewId: string) => {
    reviewService.delete(reviewId)
      .then(() => {
        const newCount = totalCount - 1
        const newTotalPages = Math.max(1, Math.ceil(newCount / PAGE_SIZE))
        const targetPage = page > newTotalPages ? newTotalPages : page
        if (targetPage !== page) {
          setPage(targetPage)
        } else {
          fetchPage(page)
        }
      })
      .catch(console.error)
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Moje ocene</h1>
        <p className="text-sm text-gray-400 mt-1">{totalCount} ocena</p>
      </div>

      <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-sm text-gray-400">
            Učitavanje...
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 font-light italic">
            Niste ostavili nijednu ocenu.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 bg-neutral-50 border-b border-neutral-100">
                <th className="px-6 py-3">Proizvod</th>
                <th className="px-6 py-3">Datum komentara</th>
                <th className="px-6 py-3">Kvalitet</th>
                <th className="px-6 py-3">Dizajn</th>
                <th className="px-6 py-3">Performanse</th>
                <th className="px-6 py-3">Ukupno</th>
                <th className="px-6 py-3">Pozitivno</th>
                <th className="px-6 py-3">Negativno</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review.reviewId} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-neutral-800 text-sm">{review.productName}</span>
                  </td>
                  <td className="px-6 py-4 text-neutral-500 text-xs whitespace-nowrap">
                    {review.comment ? fmtDate(review.comment.date) : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <Stars value={review.qualityGrade} />
                  </td>
                  <td className="px-6 py-4">
                    <Stars value={review.designGrade} />
                  </td>
                  <td className="px-6 py-4">
                    <Stars value={review.performanceGrade} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 font-bold text-yellow-500 text-sm">
                      <FaStar size={13} />
                      {review.totalGrade.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-45">
                    <p className="text-xs text-neutral-600 line-clamp-2">
                      {review.comment?.positiveText || <span className="text-gray-300">—</span>}
                    </p>
                  </td>
                  <td className="px-6 py-4 max-w-45">
                    <p className="text-xs text-neutral-600 line-clamp-2">
                      {review.comment?.negativeText || <span className="text-gray-300">—</span>}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(review.reviewId)}
                      className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <FiChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer
                ${p === page ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-200'}`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default ReviewsPage
