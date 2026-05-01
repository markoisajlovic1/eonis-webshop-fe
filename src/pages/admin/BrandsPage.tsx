import { useState, useEffect, useCallback } from 'react'
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { IoIosAddCircleOutline } from 'react-icons/io'
import BrandCard from '../../components/admin/BrandCard'
import BrandDialog from '../../dialogs/BrandDialog'
import ConfirmationDialog from '../../dialogs/ConfirmationDialog'
import { brandService } from '../../services/brandService'
import type { BrandDTO, BrandSort } from '../../types/brand'

const PAGE_SIZE = 12

const SORT_OPTIONS = ['Naziv A-Z', 'Naziv Z-A']
const SORT_MAP: Record<string, BrandSort> = {
  'Naziv A-Z': 'NameAsc',
  'Naziv Z-A': 'NameDesc',
}

const BrandsPage = () => {
  const [brands, setBrands] = useState<BrandDTO[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('Naziv A-Z')
  const [page, setPage] = useState(1)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editBrand, setEditBrand] = useState<BrandDTO | null>(null)
  const [deleteBrand, setDeleteBrand] = useState<BrandDTO | null>(null)

  const fetchBrands = useCallback((pageNumber: number) => {
    setLoading(true)
    brandService.filter({
      term: search.trim() || undefined,
      sort: SORT_MAP[sort] ?? 'NameAsc',
      pageNumber,
      pageSize: PAGE_SIZE,
    })
      .then((result) => {
        setBrands(result.items)
        setTotalCount(result.totalCount)
        setTotalPages(result.totalPages)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [search, sort])

  useEffect(() => {
    const timeout = setTimeout(() => fetchBrands(page), search ? 300 : 0)
    return () => clearTimeout(timeout)
  }, [fetchBrands, search, page])

  // Reset na prvu stranu kad se promene filteri
  const handleSearchChange = (v: string) => { setSearch(v); setPage(1) }
  const handleSortChange = (v: string) => { setSort(v); setPage(1) }

  const handleDelete = () => {
    if (!deleteBrand) return
    brandService.delete(deleteBrand.brandId)
      .then(() => {
        setDeleteBrand(null)
        if (brands.length === 1 && page > 1) {
          setPage((p) => p - 1)
        } else {
          fetchBrands(page)
        }
      })
      .catch(console.error)
  }

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Brendovi</h1>
          <span className="text-sm text-gray-400">{totalCount} brendova</span>
        </div>
        <button
          onClick={() => setAddDialogOpen(true)}
          className="bg-blue-500 px-5 py-1.5 text-white rounded-md cursor-pointer flex items-center gap-2"
        >
          <IoIosAddCircleOutline />
          Dodaj brend
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Pretraži brendove..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm placeholder:text-gray-400 outline-none focus:border-amber-400 transition-all"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-700 outline-none cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-sm text-gray-400">
          Učitavanje...
        </div>
      ) : brands.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-sm text-gray-400">
          Nema brendova u bazi
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-4">
          {brands.map((brand) => (
            <BrandCard
              key={brand.brandId}
              name={brand.brandName}
              logo={brand.brandImage}
              onEdit={() => setEditBrand(brand)}
              onDelete={() => setDeleteBrand(brand)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <FiChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer
                ${p === page
                  ? 'bg-blue-500 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      )}

      {addDialogOpen && (
        <BrandDialog
          action="insert"
          onClose={() => setAddDialogOpen(false)}
          onSaved={() => fetchBrands(page)}
        />
      )}

      {editBrand && (
        <BrandDialog
          action="edit"
          brand={editBrand}
          onClose={() => setEditBrand(null)}
          onSaved={() => { setEditBrand(null); fetchBrands(page) }}
        />
      )}

      {deleteBrand && (
        <ConfirmationDialog
          title="Obriši brend"
          text={`Da li ste sigurni da želite da obrišete brend "${deleteBrand.brandName}"?`}
          onConfirm={handleDelete}
          onClose={() => setDeleteBrand(null)}
        />
      )}
    </div>
  )
}

export default BrandsPage
