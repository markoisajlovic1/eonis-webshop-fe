import { useState, useEffect, useCallback } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { orderService } from '../../services/orderService'
import type { OrderDTO, OrderSort } from '../../types/order'

const PAGE_SIZE = 12

const SORT_OPTIONS: { label: string; value: OrderSort }[] = [
  { label: 'Datum (Najnovije)', value: 'DateDesc' },
  { label: 'Datum (Najstarije)', value: 'DateAsc' },
]

const fmtDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' })

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<OrderDTO[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<OrderSort>('DateDesc')
  const [page, setPage] = useState(1)

  const fetchPage = useCallback((p: number) => {
    setLoading(true)
    orderService.filter({ sort, pageNumber: p, pageSize: PAGE_SIZE })
      .then(result => {
        setOrders(result.items)
        setTotalCount(result.totalCount)
        setTotalPages(Math.max(1, result.totalPages))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [sort])

  useEffect(() => {
    fetchPage(page)
  }, [page, fetchPage])

  const handleSortChange = (v: OrderSort) => { setSort(v); setPage(1) }

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Porudžbine</h1>
          <span className="text-sm text-gray-400">{totalCount} porudžbina</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500">Sortiraj po:</span>
          <select
            value={sort}
            onChange={e => handleSortChange(e.target.value as OrderSort)}
            className="px-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-700 outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 bg-neutral-50 border-b border-neutral-100">
              <th className="px-6 py-3.5">ID porudžbine</th>
              <th className="px-6 py-3.5">Korisnik ID</th>
              <th className="px-6 py-3.5">Datum</th>
              <th className="px-6 py-3.5">Kupon</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                  Učitavanje...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400 italic font-light">
                  Nema porudžbina
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.orderId} className="hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-0">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-neutral-500">{order.orderId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-neutral-500">{order.userId}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-800">
                    {fmtDate(order.date)}
                  </td>
                  <td className="px-6 py-4">
                    {order.codeId ? (
                      <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Kupon primenjen
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
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
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <FiChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer
                ${p === page ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminOrdersPage
