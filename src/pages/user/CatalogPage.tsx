import React, { useState, useEffect, useRef, useMemo } from 'react';
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

  const selectedCategory: CategoryDTO | null = useMemo(
    () => categories.find(c => toSlug(c.name) === filters.category) ?? null,
    [categories, filters.category]
  )

  const { data: subcategories = [], isFetching: subcategoriesLoading } = useSubcategories(
    selectedCategory?.categoryId ?? null
  )

  const validSubcategories = useMemo(() => {
    if (!selectedCategory) return []
    const validSlugs = new Set(subcategories.map(s => toSlug(s.name)))
    return filters.subcategories.filter(s => validSlugs.has(s))
  }, [subcategories, filters.subcategories, selectedCategory])

  const [products, setProducts] = useState<ProductDTO[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // priceAbsolute = the full min/max bounds of the slider (set only when category/brand/subcat change)
  const [priceAbsolute, setPriceAbsolute] = useState<{ min: number; max: number } | null>(null)
  // priceRange = what the slider UI currently shows (thumb positions)
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null)
  // appliedPriceRange = committed value sent to the API
  const [appliedPriceRange, setAppliedPriceRange] = useState<[number, number] | null>(null)

  const brandsKey = filters.brands.join(',')
  const subcatsKey = validSubcategories.join(',')

  // Track the "structural" filter key (category/brand/subcat) separately from price/sort/page.
  // When structural filters change → reset price bounds AND applied price.
  const prevStructuralKey = useRef<string>('')

  useEffect(() => {
    const structuralKey = `${filters.category}|${brandsKey}|${subcatsKey}`
    const structuralChanged = structuralKey !== prevStructuralKey.current
    prevStructuralKey.current = structuralKey

    // When structural filters change, clear the applied price so the request
    // goes out WITHOUT a price constraint, letting the API return the true
    // min/max for the new filter combination.
    if (structuralChanged) {
      setAppliedPriceRange(null)
      setPriceAbsolute(null)
      setPriceRange(null)
    }

    // Use the current appliedPriceRange unless we just reset it above.
    // Because setState is async we read the "next" value directly here.
    const priceToSend = structuralChanged ? null : appliedPriceRange

    let cancelled = false
    setLoading(true)

    const brandsArr = brandsKey ? brandsKey.split(',') : []
    const subcatsArr = subcatsKey ? subcatsKey.split(',') : []

    productService.publicFilter({
      category: filters.category ?? undefined,
      subcategory: subcatsArr.length > 0 ? subcatsArr : undefined,
      brand: brandsArr.length > 0 ? brandsArr : undefined,
      priceMin: priceToSend?.[0] ?? undefined,
      priceMax: priceToSend?.[1] ?? undefined,
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
          const { minPrice, maxPrice } = result.filters

          if (structuralChanged) {
            // Fresh filter combination → set the slider bounds AND reset selection to full range
            setPriceAbsolute({ min: minPrice, max: maxPrice })
            setPriceRange([minPrice, maxPrice])
            setAppliedPriceRange([minPrice, maxPrice])
          } else {
            // Price/sort/page change → keep slider bounds as they are,
            // only initialise them if they haven't been set yet.
            setPriceAbsolute(prev => prev ?? { min: minPrice, max: maxPrice })
            setPriceRange(prev => prev ?? [minPrice, maxPrice])
            setAppliedPriceRange(prev => prev ?? [minPrice, maxPrice])
          }
        }
      })
      .catch(err => { if (!cancelled) console.error(err) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [filters.category, brandsKey, subcatsKey, filters.sort, filters.page, appliedPriceRange])

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
                    onCommit={setAppliedPriceRange}
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <span className="text-[10px] text-neutral-400 block ml-1 uppercase">Od</span>
                      <input
                        type="number"
                        value={Math.round(priceRange[0])}
                        min={priceAbsolute.min}
                        max={priceRange[1]}
                        onChange={e => {
                          const v: [number, number] = [Number(e.target.value), priceRange[1]]
                          setPriceRange(v)
                          setAppliedPriceRange(v)
                        }}
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
                        onChange={e => {
                          const v: [number, number] = [priceRange[0], Number(e.target.value)]
                          setPriceRange(v)
                          setAppliedPriceRange(v)
                        }}
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
                    quantity={product.quantity}
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