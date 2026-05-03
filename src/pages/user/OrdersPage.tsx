import { useState, useEffect, useMemo } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { FaAngleDown } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import { orderService } from '../../services/orderService'
import type { OrderDTO, OrderSort, OrderItemWithProductDTO } from '../../types/order'

const PAGE_SIZE = 12

const SORT_OPTIONS: { label: string; value: OrderSort }[] = [
  { label: 'Datum (Najnovije)', value: 'DateDesc' },
  { label: 'Datum (Najstarije)', value: 'DateAsc' },
]

const fmtDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' })

const fmtPrice = (n: number) => n.toLocaleString('sr-RS')

const OrdersPage = () => {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const [orders, setOrders] = useState<OrderDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<OrderSort>('DateDesc')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [itemsMap, setItemsMap] = useState<Record<string, OrderItemWithProductDTO[]>>({})
  const [itemsLoading, setItemsLoading] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    orderService.getByUserId(userId)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [userId])

  const sorted = useMemo(() => {
    return [...orders].sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime()
      return sort === 'DateAsc' ? diff : -diff
    })
  }, [orders, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSort = (value: OrderSort) => {
    setSort(value)
    setPage(1)
  }

  const handleOpenDetails = (orderId: string) => {
    if (expandedId === orderId) {
      setExpandedId(null)
      return
    }
    setExpandedId(orderId)
    if (itemsMap[orderId]) return
    setItemsLoading(orderId)
    orderService.getItemsByOrderId(orderId)
      .then(items => setItemsMap(prev => ({ ...prev, [orderId]: items })))
      .catch(console.error)
      .finally(() => setItemsLoading(null))
  }

  return (
    <div className="p-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Moje porudžbine</h1>
          <p className="text-sm text-gray-400 mt-1">{orders.length} porudžbina</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500">Sortiraj po:</span>
          <select
            value={sort}
            onChange={e => handleSort(e.target.value as OrderSort)}
            className="bg-gray-100 border border-neutral-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-black cursor-pointer"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-sm text-gray-400">
            Učitavanje...
          </div>
        ) : paginated.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 font-light italic">
            Trenutno nemate aktivnih porudžbina.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 bg-neutral-50 border-b border-neutral-100">
                <th className="px-6 py-3">ID porudžbine</th>
                <th className="px-6 py-3">Datum</th>
                <th className="px-6 py-3">Kupon</th>
                <th className="py-3 text-center">Detalji</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(order => (
                <>
                  <tr key={order.orderId} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-neutral-500">{order.orderId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-neutral-800">{fmtDate(order.date)}</span>
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
                    <td className="flex items-center justify-center py-4">
                      <button
                        onClick={() => handleOpenDetails(order.orderId)}
                        className="cursor-pointer text-neutral-400 hover:text-black transition-colors"
                      >
                        <FaAngleDown
                          className={`transition-transform duration-200 ${expandedId === order.orderId ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </td>
                  </tr>

                  {expandedId === order.orderId && (
                    <tr key={`${order.orderId}-details`} className="bg-neutral-50 border-b border-neutral-100">
                      <td colSpan={4} className="px-6 py-4">
                        {itemsLoading === order.orderId ? (
                          <p className="text-xs text-gray-400">Učitavanje stavki...</p>
                        ) : (itemsMap[order.orderId] ?? []).length === 0 ? (
                          <p className="text-xs text-gray-400">Nema stavki u ovoj porudžbini.</p>
                        ) : (
                          // naruceni proizvodi za order
                          <div className="flex flex-col gap-3">
                            <div className='flex items-center justify-between'>
                              <span className='font-semibold text-md'>Ukupno placeno</span>
                              <span className='bg-yellow-300 px-3 rounded-md'>{fmtPrice(itemsMap[order.orderId].reduce((sum, item) => sum + item.product.price * (1 - item.product.discount / 100) * item.quantity, 0))} RSD</span>
                            </div>
                            <hr />
                            {itemsMap[order.orderId].map(item => (
                              <div key={item.product.productId} className="flex items-center gap-4 bg-white rounded-lg border border-neutral-100 px-4 py-3">
                                <div className="w-12 h-12 shrink-0 rounded-lg bg-neutral-50 border border-neutral-100 overflow-hidden flex items-center justify-center p-1">
                                  <img
                                    src={item.product.images[0]?.imageLink ?? ''}
                                    alt={item.product.productName}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-neutral-800 text-sm truncate">{item.product.productName}</p>
                                  <p className="text-xs text-gray-400 mt-0.5">Količina: {item.quantity}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="font-semibold text-sm text-neutral-800">
                                    {fmtPrice(item.product.price * (1 - item.product.discount / 100) * item.quantity)} RSD
                                  </p>
                                  {item.product.discount > 0 && (
                                    <p className="text-xs text-gray-400 line-through">
                                      {fmtPrice(item.product.price * item.quantity)} RSD
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>  
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <FiChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer
                ${p === page ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-200'}`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default OrdersPage
