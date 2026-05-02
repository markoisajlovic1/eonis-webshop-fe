import type { CommentDTO } from './comment'
export type { CommentDTO }

export interface ReviewDTO {
  reviewId: string
  qualityGrade: number
  designGrade: number
  performanceGrade: number
  totalGrade: number
  userId: string
  productId: string
  comment: CommentDTO | null
}

export interface ProductReviewAveragesDTO {
  qualityGrade: number
  designGrade: number
  performanceGrade: number
  totalGrade: number
  qualityCounts: Record<string, number>
  designCounts: Record<string, number>
  performanceCounts: Record<string, number>
}

export interface CreateReviewDTO {
  qualityGrade: number
  designGrade: number
  performanceGrade: number
  userId: string
  productId: string
}

export interface UpdateReviewDTO {
  qualityGrade: number
  designGrade: number
  performanceGrade: number
}

export interface ReviewError {
  message: string
  statusCode?: number
}
