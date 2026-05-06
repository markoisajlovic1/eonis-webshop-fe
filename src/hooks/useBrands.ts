import { useQuery } from '@tanstack/react-query'
import { brandService } from '../services/brandService'

export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => brandService.getAll(),
    staleTime: 5 * 60 * 1000,
  })
}
