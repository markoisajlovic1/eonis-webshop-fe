import { useState, useEffect } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import { cartService } from '../../services/cartService/cartService'
import { cartServiceLS } from '../../services/cartService/cartServiceLS'
import { productService } from '../../services/productService'
import { paymentService } from '../../services/paymentService'

interface CartRow {
  productId: string
  name: string
  category: string
  price: number
  quantity: number
  image: string
}

const fmt = (n: number) => n.toLocaleString('sr-RS')

const CartPage = () => {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const [items, setItems] = useState<CartRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      cartService.getByUserId(userId)
        .then(cartItems =>
          Promise.all(
            cartItems.map(ci =>
              productService.getById(ci.productId).then(p => ({
                productId: p.productId,
                name: p.productName,
                category: p.subcategory.subcategoryName,
                price: p.price,
                quantity: ci.quantity,
                image: p.images[0]?.imageLink ?? '',
              }))
            )
          )
        )
        .then(setItems)
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      Promise.resolve(cartServiceLS.getAll()).then(lsItems => {
        setItems(lsItems.map(i => ({
          productId: i.productId,
          name: i.productName,
          category: '',
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })))
        setLoading(false)
      })
    }
  }, [userId])

  const removeItem = (productId: string) => {
    if (userId) {
      cartService.remove(userId, productId).catch(console.error)
    } else {
      cartServiceLS.remove(productId)
    }
    setItems(prev => prev.filter(i => i.productId !== productId))
  }

  const clearCart = () => {
    if (userId) {
      items.forEach(i => cartService.remove(userId, i.productId).catch(console.error))
    } else {
      cartServiceLS.clear()
    }
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handlePay = () => {
    if (!userId || items.length === 0) return
    paymentService.createCheckoutSession({
      userId,
      items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
    })
      .then(result => { window.location.href = result.url })
      .catch(console.error)
  }

  return (
    <div className='bg-neutral-100 min-h-screen py-10'>
      <div className='flex mx-auto max-w-[1200px] px-4 gap-6 items-start'>

        {/* Proizvodi */}
        <div className='bg-white border border-gray-100 flex-1 rounded-xl overflow-hidden'>
          <div className='px-6 py-4 border-b border-neutral-100'>
            <h2 className='text-lg font-semibold text-neutral-800'>Proizvodi u korpi</h2>
            <span className='text-sm text-gray-400'>{items.length} stavki</span>
          </div>

          {loading ? (
            <div className='flex items-center justify-center py-20 text-sm text-gray-400'>
              Učitavanje...
            </div>
          ) : items.length === 0 ? (
            <div className='flex items-center justify-center py-20 text-sm text-gray-400'>
              Korpa je prazna
            </div>
          ) : (
            <table className='w-full text-sm'>
              <thead>
                <tr className='text-left text-xs text-gray-400 bg-neutral-50 border-b border-neutral-100'>
                  <th className='px-6 py-3'>Proizvod</th>
                  <th className='px-6 py-3 text-center'>Količina</th>
                  <th className='px-6 py-3 text-right'>Cena</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.productId} className='border-b border-neutral-50 last:border-0'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-4'>
                        <div className='w-14 h-14 rounded-lg bg-neutral-50 border border-neutral-100 shrink-0 overflow-hidden flex items-center justify-center p-1'>
                          <img src={item.image} alt={item.name} className='w-full h-full object-contain' />
                        </div>
                        <div className='flex flex-col'>
                          <span className='font-medium text-neutral-800'>{item.name}</span>
                          {item.category && (
                            <span className='text-xs text-gray-400 mt-0.5'>{item.category}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 text-center'>
                      <span className='inline-block px-3 py-1 bg-neutral-100 rounded-md text-neutral-700 font-medium'>
                        {item.quantity}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center justify-end gap-4'>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className='text-gray-300 hover:text-red-500 transition-colors cursor-pointer'
                        >
                          <FiTrash2 size={16} />
                        </button>
                        <span className='font-semibold text-neutral-800 min-w-[100px] text-right'>
                          {fmt(item.price * item.quantity)} RSD
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className='flex items-center gap-4 p-6'>
            <button className='py-1 px-3 rounded-md border border-gray-300 cursor-pointer'>Vrati se na katalog</button>
            <button
              onClick={clearCart}
              disabled={items.length === 0}
              className={`py-1 px-3 rounded-md text-white ${
                items.length === 0
                  ? 'bg-red-300 cursor-not-allowed'
                  : 'bg-red-500 cursor-pointer'
              }`}
            >
              Poništi korpu
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className='bg-white border border-gray-100 w-80 shrink-0 rounded-xl p-6 flex flex-col gap-4'>
          <h2 className='text-lg font-semibold text-neutral-800'>Za plaćanje</h2>
          <div className='flex flex-col gap-2 text-sm text-neutral-600'>
            {items.map((item) => (
              <div key={item.productId} className='flex justify-between'>
                <span className='truncate max-w-[160px] text-gray-400'>{item.name}</span>
                <span>{fmt(item.price * item.quantity)} RSD</span>
              </div>
            ))}
          </div>
          <div className='border-t border-neutral-100 pt-4 flex justify-between font-semibold text-neutral-800'>
            <span>Ukupno</span>
            <span>{fmt(total)} RSD</span>
          </div>
          <button
            onClick={handlePay}
            disabled={items.length === 0}
            className='w-full bg-yellow-400 hover:bg-yellow-500 transition-colors text-black font-semibold py-3 rounded-xl text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Nastavi na plaćanje
          </button>
        </div>

      </div>
    </div>
  )
}

export default CartPage
