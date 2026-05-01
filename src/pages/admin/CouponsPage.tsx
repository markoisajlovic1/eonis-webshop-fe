import { useState, useEffect, useCallback } from 'react'
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { couponService } from '../../services/couponService'
import CouponDialog from '../../dialogs/CouponDialog'
import ConfirmationDialog from '../../dialogs/ConfirmationDialog'
import type { CouponDTO, DiscountCodeSort } from '../../types/coupon'

const PAGE_SIZE = 12

const SORT_OPTIONS = ['Kod A-Z', 'Kod Z-A']
const SORT_MAP: Record<string, DiscountCodeSort> = {
  'Kod A-Z': 'CodeAsc',
  'Kod Z-A': 'CodeDesc',
}

const CouponsPage = () => {
  const [coupons, setCoupons] = useState<CouponDTO[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('Kod A-Z')
  const [page, setPage] = useState(1)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editCoupon, setEditCoupon] = useState<CouponDTO | null>(null)
  const [deleteCoupon, setDeleteCoupon] = useState<CouponDTO | null>(null)

  const fetchCoupons = useCallback((pageNumber: number) => {
    setLoading(true)
    couponService.filter({
      term: search.trim() || undefined,
      sort: SORT_MAP[sort] ?? 'CodeAsc',
      pageNumber,
      pageSize: PAGE_SIZE,
    })
      .then((result) => {
        setCoupons(result.items)
        setTotalCount(result.totalCount)
        setTotalPages(result.totalPages)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [search, sort])

  useEffect(() => {
    const timeout = setTimeout(() => fetchCoupons(page), search ? 300 : 0)
    return () => clearTimeout(timeout)
  }, [fetchCoupons, search, page])

  const handleSearchChange = (v: string) => { setSearch(v); setPage(1) }
  const handleSortChange = (v: string) => { setSort(v); setPage(1) }

  const handleDelete = () => {
    if (!deleteCoupon) return
    couponService.delete(deleteCoupon.codeId)
      .then(() => {
        setDeleteCoupon(null)
        if (coupons.length === 1 && page > 1) {
          setPage((p) => p - 1)
        } else {
          fetchCoupons(page)
        }
      })
      .catch(console.error)
  }

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Kupon kodovi</h1>
          <span className="text-sm text-gray-400">{totalCount} kupona</span>
        </div>
        <button
          onClick={() => setAddDialogOpen(true)}
          className="bg-blue-500 px-5 py-1.5 text-white rounded-md cursor-pointer flex items-center gap-2"
        >
          <IoIosAddCircleOutline />
          Novi kod
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Pretraži kupone..."
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

      <div className="bg-white rounded-xl border border-neutral-300 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 text-left text-gray-400 font-medium">
              <th className="px-6 py-3">Naziv koda</th>
              <th className="px-6 py-3">Popust</th>
              <th className="px-6 py-3">Korisnik (ID)</th>
              <th className="px-6 py-3">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  Učitavanje...
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  Nema pronađenih kupona
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.codeId} className="border-b border-neutral-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-neutral-800">{coupon.code}</td>
                  <td className="px-6 py-3 text-neutral-600">{coupon.value}%</td>
                  <td className="px-6 py-3 text-neutral-400 text-xs font-mono">{coupon.userId}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setEditCoupon(coupon)}
                        className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
                      >
                        Izmeni
                      </button>
                      <button
                        onClick={() => setDeleteCoupon(coupon)}
                        className="text-red-400 hover:text-red-600 font-medium transition-colors cursor-pointer"
                      >
                        Obriši
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
        <CouponDialog
          action="insert"
          onClose={() => setAddDialogOpen(false)}
          onSaved={() => fetchCoupons(page)}
        />
      )}

      {editCoupon && (
        <CouponDialog
          action="edit"
          coupon={editCoupon}
          onClose={() => setEditCoupon(null)}
          onSaved={() => { setEditCoupon(null); fetchCoupons(page) }}
        />
      )}

      {deleteCoupon && (
        <ConfirmationDialog
          title="Obriši kupon"
          text={`Da li ste sigurni da želite da obrišete kupon "${deleteCoupon.code}"?`}
          onConfirm={handleDelete}
          onClose={() => setDeleteCoupon(null)}
        />
      )}
    </div>
  )
}

export default CouponsPage
