import { useQuery } from '@tanstack/react-query'
import { categoryService } from '../services/categoryService'

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAllCategories(),
    staleTime: 5 * 60 * 1000,
  })
}
