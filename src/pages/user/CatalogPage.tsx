import React, { useState, useEffect, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductVerticalCard from '../../components/shared/ProductVerticalCard';
import ProductSelectFilters from '../../components/user/ProductSelectFilters';
import { useCatalogFilters } from '../../hooks/useCatalogFilters';
import { useCategories } from '../../hooks/useCategories';
import { useSubcategories } from '../../hooks/useSubcategories';
import { useBrands } from '../../hooks/useBrands';
import { productService } from '../../services/productService';
import { toSlug } from '../../utils/slug';
import DualRangeSlider from '../../components/shared/DualRangeSlider';
import type { ProductDTO, ProductSort } from '../../types/product';
import type { CategoryDTO } from '../../types/categories';

const PAGE_SIZE = 12

const SORT_OPTIONS: { label: string; value: ProductSort }[] = [
  { label: 'Nazivu (A-Z)', value: 'NameAsc' },
  { label: 'Nazivu (Z-A)', value: 'NameDesc' },
  { label: 'Ceni (Rastuće)', value: 'PriceAsc' },
  { label: 'Ceni (Opadajuće)', value: 'PriceDesc' },
]

const CatalogPage: React.FC = () => {
  const { filters, setCategory, setSubcategories, setBrands, setSort, setPage, resetAll } = useCatalogFilters()

  const { data: categories = [] } = useCategories()
  const { data: brands = [] } = useBrands()

  // Resolve selected category object from slug
  const selectedCategory: CategoryDTO | null = useMemo(
    () => categories.find(c => toSlug(c.name) === filters.category) ?? null,
    [categories, filters.category]
  )

  // Fetch subcategories only when a category is selected
  const { data: subcategories = [], isFetching: subcategoriesLoading } = useSubcategories(
    selectedCategory?.categoryId ?? null
  )

  // Drop any subcategory slugs that don't belong to current category
  const validSubcategories = useMemo(() => {
    if (!selectedCategory) return []
    const validSlugs = new Set(subcategories.map(s => toSlug(s.name)))
    return filters.subcategories.filter(s => validSlugs.has(s))
  }, [subcategories, filters.subcategories, selectedCategory])

  const [products, setProducts] = useState<ProductDTO[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [priceAbsolute, setPriceAbsolute] = useState<{ min: number; max: number } | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null)

  // Stable string deps to avoid infinite loop from array identity changes
  const brandsKey = filters.brands.join(',')
  const subcatsKey = validSubcategories.join(',')

  useEffect(() => {
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    const brands = brandsKey ? brandsKey.split(',') : []
    const subcats = subcatsKey ? subcatsKey.split(',') : []
    productService.publicFilter({
      category: filters.category ?? undefined,
      subcategory: subcats.length > 0 ? subcats : undefined,
      brand: brands.length > 0 ? brands : undefined,
      priceMin: priceRange?.[0] ?? undefined,
      priceMax: priceRange?.[1] ?? undefined,
      sort: filters.sort,
      pageNumber: filters.page,
      pageSize: PAGE_SIZE,
    })
      .then(result => {
        if (cancelled) return
        setProducts(result.items)
        setTotalCount(result.pagination.totalCount)
        setTotalPages(result.pagination.totalPages)
        if (result.filters) {
          setPriceAbsolute(prev => prev ?? { min: result.filters.minPrice, max: result.filters.maxPrice })
          setPriceRange(prev => prev ?? [result.filters.minPrice, result.filters.maxPrice])
        }
      })
      .catch(err => { if (!cancelled) console.error(err) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [filters.category, brandsKey, subcatsKey, filters.sort, filters.page, priceRange])

  const categoryOptions = useMemo(
    () => categories.map(c => ({ id: toSlug(c.name), label: c.name })),
    [categories]
  )

  const subcategoryOptions = useMemo(
    () => subcategories.map(s => ({ id: toSlug(s.name), label: s.name })),
    [subcategories]
  )

  const brandOptions = useMemo(
    () => brands.map(b => ({ id: toSlug(b.brandName), label: b.brandName })),
    [brands]
  )

  const hasActiveFilters = !!(filters.category || filters.brands.length || filters.subcategories.length || filters.priceMin || filters.priceMax)

  const pageTitle = selectedCategory?.name ?? 'Svi proizvodi'

  return (
    <div className="bg-neutral-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-4">
          <p className="text-xs text-neutral-500 mb-2 uppercase tracking-widest">
            Početna / {pageTitle}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-end gap-2">
              <h1 className="text-3xl font-semibold text-black capitalize">{pageTitle}</h1>
              <p className="text-xs text-neutral-500 uppercase tracking-widest">{totalCount} proizvoda</p>
            </div>

            <div className="flex items-center gap-2 p-4">
              <span className="text-sm text-neutral-500 whitespace-nowrap">Sortiraj po:</span>
              <select
                className="bg-gray-200 border border-neutral-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-black cursor-pointer"
                value={filters.sort}
                onChange={e => setSort(e.target.value as ProductSort)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <hr className="border-gray-400 mb-8" />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-1/4 flex flex-col gap-4">
            {hasActiveFilters && (
              <button
                onClick={resetAll}
                className="text-xs font-semibold text-neutral-500 hover:text-black transition-colors self-end underline underline-offset-2"
              >
                Resetuj filtere
              </button>
            )}

            <ProductSelectFilters
              title="Kategorije"
              mode="single"
              options={categoryOptions}
              selected={filters.category}
              onChange={slug => setCategory(slug)}
            />

            <ProductSelectFilters
              title="Potkategorije"
              mode="multi"
              options={subcategoryOptions}
              selected={validSubcategories}
              onChange={setSubcategories}
              disabled={!filters.category}
              isLoading={subcategoriesLoading}
            />

            <ProductSelectFilters
              title="Brendovi"
              mode="multi"
              options={brandOptions}
              selected={filters.brands}
              onChange={setBrands}
            />

            {/* Price Filter */}
            {priceAbsolute && priceRange && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                <h3 className="font-bold mb-4">Cena (RSD)</h3>
                <div className="flex flex-col gap-4">
                  <DualRangeSlider
                    min={priceAbsolute.min}
                    max={priceAbsolute.max}
                    step={Math.max(1, Math.ceil((priceAbsolute.max - priceAbsolute.min) / 100))}
                    value={priceRange}
                    onChange={setPriceRange}
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <span className="text-[10px] text-neutral-400 block ml-1 uppercase">Od</span>
                      <input
                        type="number"
                        value={Math.round(priceRange[0])}
                        min={priceAbsolute.min}
                        max={priceRange[1]}
                        onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] text-neutral-400 block ml-1 uppercase">Do</span>
                      <input
                        type="number"
                        value={Math.round(priceRange[1])}
                        min={priceRange[0]}
                        max={priceAbsolute.max}
                        onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Product Grid */}
          <main className="lg:w-3/4 flex flex-col gap-6">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-sm text-gray-400">
                Učitavanje...
              </div>
            ) : products.length === 0 ? (
              <div className="p-20 rounded-3xl border-neutral-200 text-center flex flex-col items-center gap-4">
                <h3 className="text-xl font-semibold italic">Nema rezultata</h3>
                <p className="text-neutral-500">Pokušajte da promenite filtere ili pretragu.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductVerticalCard
                    key={product.productId}
                    name={product.productName}
                    price={product.price}
                    oldPrice={product.discount > 0 ? product.price / (1 - product.discount / 100) : undefined}
                    image={product.images[0]?.imageLink ?? ''}
                    slug={product.productId}
                  />
                ))}
              </div>
            )}

            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-8">
                <button
                  onClick={() => setPage(Math.max(1, filters.page - 1))}
                  disabled={filters.page === 1}
                  className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <FiChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer
                      ${p === filters.page ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-200'}`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage(Math.min(totalPages, filters.page + 1))}
                  disabled={filters.page === totalPages}
                  className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
