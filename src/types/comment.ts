export interface CommentDTO {
  commentId: string
  reviewId: string | null
  date: string
  positiveText: string
  negativeText: string
}

export interface CreateCommentDTO {
  reviewId: string
  positiveText: string
  negativeText: string
}

export interface UpdateCommentDTO {
  positiveText?: string
  negativeText?: string
}

export interface ProductCommentDTO {
  commentId: string
  date: string
  positiveText: string
  negativeText: string
  firstName: string
  lastName: string
  username: string
  totalGrade: number
}

export interface CommentError {
  message: string
  statusCode?: number
}
