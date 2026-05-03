import { useQuery } from '@tanstack/react-query'
import { categoryService } from '../services/categoryService'

export const useSubcategories = (categoryId: string | null) => {
  return useQuery({
    queryKey: ['subcategories', categoryId],
    queryFn: () => categoryService.getSubcategoriesByCategoryId(categoryId!),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  })
}
