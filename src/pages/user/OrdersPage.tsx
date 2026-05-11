import { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { FaAngleDown } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import { orderService } from '../../services/orderService'
import { reviewService } from '../../services/reviewService'
import type { UserOrderDTO, OrderStatus } from '../../types/order'
import { ORDER_STATUS_LABELS } from '../../types/order'
import ReviewDialog from '../../dialogs/ReviewDialog'

const PAGE_SIZE = 12

const fmtDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' })

const fmtPrice = (n: number) => n.toLocaleString('sr-RS')

const OrdersPage = () => {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const [orders, setOrders] = useState<UserOrderDTO[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [reviewedProductIds, setReviewedProductIds] = useState<Set<string>>(new Set())
  const [reviewProduct, setReviewProduct] = useState<{ productId: string; productName: string } | null>(null)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    setLoading(true)
    orderService.getByUserId(userId, { pageNumber: page, pageSize: PAGE_SIZE })
      .then(result => {
        setOrders(result.items)
        setTotalCount(result.totalCount)
        setTotalPages(result.totalPages)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [userId, page])

  useEffect(() => {
    if (!userId) return
    reviewService.getByUserId(userId, { pageSize: 1000 })
      .then(result => setReviewedProductIds(new Set(result.items.map(r => r.productId))))
      .catch(console.error)
  }, [userId])

  const handleOpenDetails = (orderId: string) => {
    setExpandedId(prev => prev === orderId ? null : orderId)
  }

  const handleReviewed = (productId: string) => {
    setReviewedProductIds(prev => new Set(prev).add(productId))
  }

  return (
    <div className="p-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Moje porudžbine</h1>
          <p className="text-sm text-gray-400 mt-1">{totalCount} porudžbina</p>
        </div>
      </div>

      <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-sm text-gray-400">
            Učitavanje...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 font-light italic">
            Trenutno nemate aktivnih porudžbina.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 bg-neutral-50 border-b border-neutral-100">
                <th className="px-6 py-3">ID porudžbine</th>
                <th className="px-6 py-3">Datum</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Plaćeno</th>
                <th className="px-6 py-3">Kupon</th>
                <th className="px-6 py-3 text-right">Ukupno</th>
                <th className="py-3 text-center">Detalji</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <>
                  <tr key={order.orderId} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-neutral-500">{order.orderId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-neutral-800">{fmtDate(order.date)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full `}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${order.isPaid ? ' text-green-700' : ' text-red-500'}`}>
                        {order.isPaid ? 'Plaćeno' : 'Nije plaćeno'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {order.couponCode ? (
                        <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {order.couponCode} ({order.couponValue}%)
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-semibold text-neutral-800">
                          {fmtPrice(order.finalPrice ?? order.totalPrice)} RSD
                        </span>
                        {order.finalPrice != null && order.finalPrice !== order.totalPrice && (
                          <span className="text-xs text-gray-400 line-through">{fmtPrice(order.totalPrice)} RSD</span>
                        )}
                      </div>
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
                      <td colSpan={7} className="px-6 py-4">
                        {order.items.length === 0 ? (
                          <p className="text-xs text-gray-400">Nema stavki u ovoj porudžbini.</p>
                        ) : (
                          <div className="flex flex-col gap-3">
                            {order.items.map(item => {
                              const alreadyReviewed = reviewedProductIds.has(item.productId)
                              const lineTotal = item.unitDiscountedPrice * item.quantity
                              const lineTotalOld = item.unitPrice * item.quantity
                              const hasDiscount = item.unitDiscountedPrice < item.unitPrice
                              return (
                                <div key={item.productId} className="flex items-center gap-4 bg-white rounded-lg border border-neutral-100 px-4 py-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-neutral-800 text-sm truncate">{item.productName}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Količina: {item.quantity}</p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="font-semibold text-sm text-neutral-800">
                                      {fmtPrice(lineTotal)} RSD
                                    </p>
                                    {hasDiscount && (
                                      <p className="text-xs text-gray-400 line-through">
                                        {fmtPrice(lineTotalOld)} RSD
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    disabled={alreadyReviewed}
                                    onClick={() => !alreadyReviewed && setReviewProduct({ productId: item.productId, productName: item.productName })}
                                    className={`shrink-0 px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors
                                      ${alreadyReviewed
                                        ? 'border-none bg-yellow-50 text-black cursor-not-allowed'
                                        : 'border-neutral-200 hover:bg-neutral-50 cursor-pointer'}`}
                                  >
                                    {alreadyReviewed ? 'Ocenjeno' : 'Oceni'}
                                  </button>
                                </div>
                              )
                            })}
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

      {reviewProduct && userId && (
        <ReviewDialog
          productName={reviewProduct.productName}
          productId={reviewProduct.productId}
          userId={userId}
          onClose={() => setReviewProduct(null)}
          onReviewed={handleReviewed}
        />
      )}
    </div>
  )
}

export default OrdersPage
