import React, { useState, useEffect } from 'react'
import { FiX } from 'react-icons/fi'
import { orderService } from '../services/orderService'
import { toast } from 'react-toastify'
import { ORDER_STATUS_LABELS } from '../types/order'
import type { OrderAdminDetailDTO, OrderItemWithProductDTO, OrderStatus } from '../types/order'

interface OrderDetailsDialogProps {
  orderId: string,
  username: string | null,
  onClose: () => void
  onUpdated: (orderId: string, isPaid: boolean, status: OrderStatus) => void
}

const fmt = (n: number) => n.toLocaleString('sr-RS')
const fmtDate = (s: string) => new Date(s).toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' })

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ orderId, username, onClose, onUpdated }) => {
  const [order, setOrder] = useState<OrderAdminDetailDTO | null>(null)
  const [items, setItems] = useState<OrderItemWithProductDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [isPaid, setIsPaid] = useState(false)
  const [status, setStatus] = useState<OrderStatus>(0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      orderService.getByIdForAdmin(orderId),
      orderService.getItemsByOrderId(orderId),
    ])
      .then(([o, i]) => {
        setOrder(o)
        setItems(i)
        setIsPaid(o.isPaid)
        setStatus(o.status)
      })
      .catch(() => toast.error('Greška pri učitavanju detalja'))
      .finally(() => setLoading(false))
  }, [orderId])

  const isDirty = order && (isPaid !== order.isPaid || status !== order.status)

  const handleSave = async () => {
    if (!order) return
    setSaving(true)
    try {
      await orderService.update(orderId, {
        date: order.date,
        couponCode: order.couponCode ?? undefined,
        addressId: order.address.addressId,
        status,
        isPaid,
      })
      toast.success('Porudžbina ažurirana')
      onUpdated(orderId, isPaid, status)
      onClose()
    } catch {
      toast.error('Greška pri čuvanju')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-800">Detalji porudžbine</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-black transition-colors cursor-pointer">
            <FiX size={20} />
          </button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-gray-400">Učitavanje...</div>
        ) : !order ? (
          <div className="py-10 text-center text-sm text-red-400">Greška pri učitavanju</div>
        ) : (
          <>
            {/* Order info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase text-neutral-400 font-medium">ID porudžbine</span>
                <span className="font-mono text-xs text-neutral-600">{order.orderId}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase text-neutral-400 font-medium">Korisnik</span>
                <span className="text-neutral-700">{username ?? 'Guest'}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase text-neutral-400 font-medium">Datum</span>
                <span className="text-neutral-700">{fmtDate(order.date)}</span>
              </div>
              {order.couponCode && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase text-neutral-400 font-medium">Kupon</span>
                  <span className="font-mono text-neutral-700">{order.couponCode}</span>
                </div>
              )}
            </div>

            <hr className="border-neutral-100" />

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase text-neutral-400 font-medium">Adresa dostave</span>
              <div className="flex flex-col gap-x-6 gap-y-1 text-sm text-neutral-700">
                <span><span className='text-gray-500 mr-4'>Adresa dostave: </span>{order.address.streetName} {order.address.streetNumber}{order.address.floor ? `, sprat ${order.address.floor}` : ''}{order.address.doorNumber ? `, stan ${order.address.doorNumber}` : ''}</span>
                <span><span className='text-gray-500 mr-4'>Drzava i grad dostave (postanski broj): </span>{order.address.country}, {order.address.city} ({order.address.postalCode})</span>
                
              </div>
            </div>

            <hr className="border-neutral-100" />

            {/* Editable fields */}
            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase text-neutral-400 font-medium">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(Number(e.target.value) as OrderStatus)}
                  className="px-3 py-2 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black cursor-pointer"
                >
                  {(Object.entries(ORDER_STATUS_LABELS) as [string, string][]).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase text-neutral-400 font-medium">Plaćeno</label>
                <select
                  value={isPaid ? '1' : '0'}
                  onChange={e => setIsPaid(e.target.value === '1')}
                  className="px-3 py-2 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black cursor-pointer"
                >
                  <option value="1">Da</option>
                  <option value="0">Ne</option>
                </select>
              </div>
            </div>

            <hr className="border-neutral-100" />

            {/* Order items */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold uppercase text-neutral-400">Stavke</h3>
              {items.length === 0 ? (
                <p className="text-sm text-neutral-400">Nema stavki</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 border-b border-neutral-100">
                      <th className="py-2">Proizvod</th>
                      <th className="py-2 text-center">Kol.</th>
                      <th className="py-2 text-right">Cena</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.product.productId} className="border-b border-neutral-50 last:border-0">
                        <td className="py-2.5 flex items-center gap-3">
                          <img
                            src={item.product.images[0]?.imageLink ?? ''}
                            alt={item.product.productName}
                            className="w-10 h-10 object-cover rounded-lg bg-neutral-100"
                          />
                          <span className="font-medium text-neutral-800">{item.product.productName}</span>
                        </td>
                        <td className="py-2.5 text-center text-neutral-600">{item.quantity}</td>
                        <td className="py-2.5 text-right text-neutral-700">{fmt(item.product.price)} RSD</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-neutral-600 hover:text-black transition-colors cursor-pointer"
              >
                Otkaži
              </button>
              <button
                onClick={handleSave}
                disabled={!isDirty || saving}
                className="px-4 py-2 text-sm font-semibold bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {saving ? 'Čuvanje...' : 'Sačuvaj izmene'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetailsDialog
