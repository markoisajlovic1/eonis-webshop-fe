import { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { FaStar } from 'react-icons/fa'
import { reviewService } from '../services/reviewService'
import { commentService } from '../services/commentService'

interface ReviewDialogProps {
  productName: string
  productId: string
  userId: string
  onClose: () => void
  onReviewed: (productId: string) => void
}

interface StarRatingProps {
  label: string
  value: number
  onChange: (v: number) => void
}

const StarRating = ({ label, value, onChange }: StarRatingProps) => {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-neutral-600">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="cursor-pointer transition-colors"
          >
            <FaStar
              size={20}
              className={star <= (hovered || value) ? 'text-yellow-400' : 'text-neutral-200'}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

const ReviewDialog = ({ productName, productId, userId, onClose, onReviewed }: ReviewDialogProps) => {
  const [qualityGrade, setQualityGrade] = useState(0)
  const [designGrade, setDesignGrade] = useState(0)
  const [performanceGrade, setPerformanceGrade] = useState(0)
  const [positiveComment, setPositiveComment] = useState('')
  const [negativeComment, setNegativeComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const totalGrade = qualityGrade && designGrade && performanceGrade
    ? Math.round(((qualityGrade + designGrade + performanceGrade) / 3) * 10) / 10
    : null

  const handleSubmit = async () => {
    if (!qualityGrade || !designGrade || !performanceGrade) return
    setSubmitting(true)
    try {
      const review = await reviewService.create({ qualityGrade, designGrade, performanceGrade, userId, productId })
      if (positiveComment.trim() || negativeComment.trim()) {
        await commentService.create({
          reviewId: review.reviewId,
          positiveText: positiveComment.trim(),
          negativeText: negativeComment.trim(),
        })
      }
      onReviewed(productId)
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[480px] p-6 flex flex-col gap-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <IoClose size={22} />
        </button>

        <div>
          <h2 className="text-lg font-semibold text-neutral-800">Oceni proizvod</h2>
          <p className="text-sm text-gray-400 mt-0.5 truncate">{productName}</p>
        </div>

        <div className="flex flex-col gap-3 bg-neutral-50 rounded-lg p-4">
          <StarRating label="Kvalitet" value={qualityGrade} onChange={setQualityGrade} />
          <StarRating label="Dizajn" value={designGrade} onChange={setDesignGrade} />
          <StarRating label="Performanse" value={performanceGrade} onChange={setPerformanceGrade} />

          {totalGrade !== null && (
            <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
              <span className="text-sm font-semibold text-neutral-700">Ukupna ocena</span>
              <span className="flex items-center gap-1 font-bold text-yellow-500">
                <FaStar size={16} />
                {totalGrade.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">Pozitivni utisci</label>
            <textarea
              value={positiveComment}
              onChange={e => setPositiveComment(e.target.value)}
              rows={2}
              placeholder="Šta vam se svidelo?"
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-400 resize-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">Negativni utisci</label>
            <textarea
              value={negativeComment}
              onChange={e => setNegativeComment(e.target.value)}
              rows={2}
              placeholder="Šta biste poboljšali?"
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-400 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-neutral-200 rounded-lg text-sm text-neutral-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Otkaži
          </button>
          <button
            onClick={handleSubmit}
            disabled={!qualityGrade || !designGrade || !performanceGrade || submitting}
            className="flex-1 py-2.5 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold rounded-lg text-sm transition-colors cursor-pointer"
          >
            {submitting ? 'Slanje...' : 'Pošalji ocenu'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReviewDialog
