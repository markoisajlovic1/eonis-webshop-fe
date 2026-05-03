import { useQuery } from '@tanstack/react-query'
import { categoryService } from '../services/categoryService'

export const useAllSubcategories = () => {
  return useQuery({
    queryKey: ['subcategories', 'all'],
    queryFn: () => categoryService.getAllSubcategories(),
    staleTime: 5 * 60 * 1000,
  })
}
