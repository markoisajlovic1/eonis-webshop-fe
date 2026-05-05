import { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { FiSearch } from 'react-icons/fi'
import { orderService } from '../services/orderService'
import type { OrderDTO, OrderItemWithProductDTO, OrderStatus } from '../types/order'

interface CheckOrderStatusDialogProps {
  onClose: () => void
}

const fmtDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' })

const fmtPrice = (n: number) => n.toLocaleString('sr-RS')

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  0: { label: 'Primljena',    className: 'bg-blue-100 text-blue-700' },
  1: { label: 'U transportu', className: 'bg-yellow-100 text-yellow-700' },
  2: { label: 'Isporučena',   className: 'bg-green-100 text-green-700' },
}

const CheckOrderStatusDialog = ({ onClose }: CheckOrderStatusDialogProps) => {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<OrderDTO | null>(null)
  const [items, setItems] = useState<OrderItemWithProductDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = () => {
    const id = orderId.trim()
    if (!id) return
    setLoading(true)
    setError(null)
    setOrder(null)
    setItems([])

    orderService.getById(id)
      .then(o => {
        setOrder(o)
        return orderService.getItemsByOrderId(id)
      })
      .then(setItems)
      .catch(() => setError('Porudžbina sa datim ID-jem nije pronađena.'))
      .finally(() => setLoading(false))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  const total = items.reduce(
    (sum, item) => sum + item.product.price * (1 - item.product.discount / 100) * item.quantity,
    0
  )

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-140 p-6 flex flex-col gap-5 relative max-h-[85vh] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <IoClose size={22} />
        </button>

        <div>
          <h2 className="text-lg font-semibold text-neutral-800">Proveri status porudžbine</h2>
          <p className="text-sm text-gray-400 mt-0.5">Unesite ID porudžbine da biste videli detalje</p>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="npr. 3fa85f64-5717-4562-b3fc-2c963f66afa6"
              className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-yellow-400 transition-colors pr-10 font-mono placeholder:font-sans placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!orderId.trim() || loading}
            className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold rounded-lg text-sm transition-colors cursor-pointer flex items-center gap-2"
          >
            <FiSearch size={15} />
            Pretraži
          </button>
        </div>

        {/* States */}
        {loading && (
          <p className="text-sm text-gray-400 text-center py-4">Učitavanje...</p>
        )}

        {error && (
          <p className="text-sm text-red-500 text-center py-4">{error}</p>
        )}

        {order && !loading && (
          <div className="flex flex-col gap-4 overflow-y-auto">
            {/* Order meta */}
            <div className="bg-neutral-50 rounded-lg p-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">ID porudžbine</span>
                <span className="font-mono text-xs text-neutral-600">{order.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Datum</span>
                <span className="font-medium text-neutral-800">{fmtDate(order.date)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_CONFIG[order.status].className}`}>
                  {STATUS_CONFIG[order.status].label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Kupon</span>
                {order.codeId ? (
                  <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    Kupon primenjen
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>
              {/* <div className="flex justify-between border-t border-neutral-200 pt-2 mt-1">
                <span className="font-semibold text-neutral-700">Ukupno plaćeno</span>
                <span className="font-bold text-neutral-800 bg-yellow-300 px-2 rounded-md">
                  {fmtPrice(total)} RSD
                </span>
              </div> */}
            </div>

            {/* Items */}
            <div className="flex flex-col gap-2">
              {items.map(item => (
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
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckOrderStatusDialog
