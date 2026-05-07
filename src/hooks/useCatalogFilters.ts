import { useSearchParams } from 'react-router-dom'
import { useMemo, useCallback } from 'react'
import type { ProductSort } from '../types/product'

export interface CatalogFilters {
  category: string | null
  subcategories: string[]
  brands: string[]
  priceMin: number | null
  priceMax: number | null
  sort: ProductSort
  page: number
}

const DEFAULT_SORT: ProductSort = 'NameAsc'

export const useCatalogFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: CatalogFilters = useMemo(() => ({
    category: searchParams.get('category'),
    subcategories: searchParams.getAll('subcategory'),
    brands: searchParams.getAll('brand'),
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : null,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : null,
    sort: (searchParams.get('sort') as ProductSort) ?? DEFAULT_SORT,
    page: Number(searchParams.get('page') ?? '1'),
  }), [searchParams])

  const setFilters = useCallback((patch: Partial<CatalogFilters>) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      const merged = { ...filters, ...patch }

      next.delete('category')
      next.delete('subcategory')
      next.delete('brand')
      next.delete('priceMin')
      next.delete('priceMax')
      next.delete('sort')
      next.delete('page')

      if (merged.category) next.set('category', merged.category)
      merged.subcategories.forEach(s => next.append('subcategory', s))
      merged.brands.forEach(b => next.append('brand', b))
      if (merged.priceMin != null) next.set('priceMin', String(merged.priceMin))
      if (merged.priceMax != null) next.set('priceMax', String(merged.priceMax))
      if (merged.sort !== DEFAULT_SORT) next.set('sort', merged.sort)
      if (merged.page > 1) next.set('page', String(merged.page))

      return next
    }, { replace: false })
  }, [filters, setSearchParams])

  const setCategory = useCallback((slug: string | null) => {
    setFilters({ category: slug, subcategories: [], page: 1 })
  }, [setFilters])

  const setSubcategories = useCallback((slugs: string[]) => {
    setFilters({ subcategories: slugs, page: 1 })
  }, [setFilters])

  const setBrands = useCallback((slugs: string[]) => {
    setFilters({ brands: slugs, page: 1 })
  }, [setFilters])

  const setSort = useCallback((sort: ProductSort) => {
    setFilters({ sort, page: 1 })
  }, [setFilters])

  const setPage = useCallback((page: number) => {
    setFilters({ page })
  }, [setFilters])

  const setPriceRange = useCallback((min: number | null, max: number | null) => {
    setFilters({ priceMin: min, priceMax: max, page: 1 })
  }, [setFilters])

  const resetAll = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: false })
  }, [setSearchParams])

  return { filters, setCategory, setSubcategories, setBrands, setSort, setPage, setPriceRange, resetAll }
}
