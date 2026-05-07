import { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { orderService } from '../../services/orderService'
import { ORDER_STATUS_LABELS } from '../../types/order'
import type { OrderFilterDTO, OrderSort, OrderStatus } from '../../types/order'
import OrderDetailsDialog from '../../dialogs/OrderDetailsDialog'

const PAGE_SIZE = 8

const SORT_OPTIONS: { label: string; value: OrderSort }[] = [
  { label: 'Datum (Najnovije)', value: 'DateDesc' },
  { label: 'Datum (Najstarije)', value: 'DateAsc' },
]

const STATUS_OPTIONS: { label: string; value: OrderStatus | '' }[] = [
  { label: 'Svi statusi', value: '' },
  { label: 'Primljeno', value: 0 },
  { label: 'U obradi', value: 1 },
  { label: 'Isporučeno', value: 2 },
]

const fmtDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' })

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<OrderFilterDTO[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<OrderSort>('DateDesc')
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('')
  const [isPaidFilter, setIsPaidFilter] = useState<'' | 'true' | 'false'>('')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    orderService.filter({
      sort,
      pageNumber: page,
      pageSize: PAGE_SIZE,
      ...(statusFilter !== '' ? { status: statusFilter } : {}),
      ...(isPaidFilter !== '' ? { isPaid: isPaidFilter === 'true' } : {}),
    })
      .then(result => {
        if (cancelled) return
        setOrders(result.items)
        setTotalCount(result.totalCount)
        setTotalPages(Math.max(1, result.totalPages))
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [sort, page, statusFilter, isPaidFilter])

  const handleSortChange = (v: OrderSort) => { setSort(v); setPage(1) }
  const handleStatusChange = (v: OrderStatus | '') => { setStatusFilter(v); setPage(1) }
  const handleIsPaidChange = (v: '' | 'true' | 'false') => { setIsPaidFilter(v); setPage(1) }

  const handleUpdated = (orderId: string, isPaid: boolean, status: OrderStatus) => {
    setOrders(prev => prev.map(o =>
      o.orderId === orderId ? { ...o, isPaid, status } : o
    ))
  }

  return (
    <>
      <div className="p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Porudžbine</h1>
            <span className="text-sm text-gray-400">{totalCount} porudžbina</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={e => handleStatusChange(e.target.value === '' ? '' : Number(e.target.value) as OrderStatus)}
              className="px-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-700 outline-none cursor-pointer"
            >
              {STATUS_OPTIONS.map(o => (
                <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
              ))}
            </select>

            <select
              value={isPaidFilter}
              onChange={e => handleIsPaidChange(e.target.value as '' | 'true' | 'false')}
              className="px-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-700 outline-none cursor-pointer"
            >
              <option value="">Sva plaćanja</option>
              <option value="true">Plaćeno</option>
              <option value="false">Nije plaćeno</option>
            </select>

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
                <th className="px-6 py-3.5">Korisnik</th>
                <th className="px-6 py-3.5">Datum</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Plaćeno</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    Učitavanje...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400 italic font-light">
                    Nema porudžbina
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr
                    key={order.orderId}
                    onClick={() => {
                      setSelectedOrderId(order.orderId)
                      setSelectedUsername(order.username)
                    }}
                    className="hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-0 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-neutral-500">{order.orderId}</span>
                    </td>
                    <td className="px-6 py-4 text-neutral-700">
                      {order.username ?? 'Guest'}
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-800">
                      {fmtDate(order.date)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${order.status === 2 ? 'bg-green-50 text-green-700' :
                          order.status === 1 ? 'bg-blue-50 text-blue-700' :
                          'bg-amber-50 text-amber-700'}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${order.isPaid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {order.isPaid ? 'Da' : 'Ne'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && totalPages > 1 && (
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

      {selectedOrderId && (
        <OrderDetailsDialog
          orderId={selectedOrderId}
          username={selectedUsername}
          onClose={() => setSelectedOrderId(null)}
          onUpdated={handleUpdated}
        />
      )}
    </>
  )
}

export default AdminOrdersPage
