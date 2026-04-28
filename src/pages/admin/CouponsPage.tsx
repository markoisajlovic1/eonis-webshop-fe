import { useState, useMemo, useEffect } from 'react'
import { FiSearch } from 'react-icons/fi'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { couponService } from '../../services/couponService'
import CouponDialog from '../../dialogs/CouponDialog'
import ConfirmationDialog from '../../dialogs/ConfirmationDialog'
import type { CouponDTO } from '../../types/coupon'

const CouponsPage = () => {
  const [coupons, setCoupons] = useState<CouponDTO[]>([])
  const [search, setSearch] = useState('')
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editCoupon, setEditCoupon] = useState<CouponDTO | null>(null)
  const [deleteCoupon, setDeleteCoupon] = useState<CouponDTO | null>(null)

  useEffect(() => {
    couponService.getAll().then(setCoupons).catch(console.error)
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return coupons
    return coupons.filter((c) =>
      c.code.toLowerCase().includes(search.toLowerCase())
    )
  }, [coupons, search])

  const handleDelete = () => {
    if (!deleteCoupon) return
    couponService.delete(deleteCoupon.codeId)
      .then(() => {
        setCoupons((prev) => prev.filter((c) => c.codeId !== deleteCoupon.codeId))
        setDeleteCoupon(null)
      })
      .catch(console.error)
  }

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Kupon kodovi</h1>
          <span className="text-sm text-gray-400">{filtered.length} kupona</span>
        </div>
        <button
          onClick={() => setAddDialogOpen(true)}
          className="bg-blue-500 px-5 py-1.5 text-white rounded-md cursor-pointer flex items-center gap-2"
        >
          <IoIosAddCircleOutline />
          Novi kod
        </button>
      </div>

      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Pretraži kupone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm placeholder:text-gray-400 outline-none focus:border-amber-400 transition-all"
        />
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  Nema pronađenih kupona
                </td>
              </tr>
            ) : (
              filtered.map((coupon) => (
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

      {addDialogOpen && (
        <CouponDialog
          action="insert"
          onClose={() => setAddDialogOpen(false)}
          onSaved={(coupon) => setCoupons((prev) => [...prev, coupon])}
        />
      )}

      {editCoupon && (
        <CouponDialog
          action="edit"
          coupon={editCoupon}
          onClose={() => setEditCoupon(null)}
          onSaved={(updated) => setCoupons((prev) => prev.map((c) => c.codeId === updated.codeId ? updated : c))}
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
