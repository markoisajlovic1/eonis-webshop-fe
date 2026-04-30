import { useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'

interface CartItem {
  id: number
  name: string
  category: string
  price: number
  quantity: number
  image: string
}

const mockCartItems: CartItem[] = [
  {
    id: 1,
    name: 'ASUS ROG Zephyrus G14',
    category: 'Gaming laptopovi',
    price: 249999,
    quantity: 1,
    image: 'https://gigatron.rs/_next/image?url=https%3A%2F%2Fbackend.gigatron.rs%2Fmedia%2Fcatalog%2Fproduct%2Fcache%2Fd62e1a0582bf7257bddc609f302ce89c%2F8%2F6%2F8680096106743.jpg&w=2048&q=75',
  },
  {
    id: 2,
    name: 'SAMSUNG Televizor 55 QLED Q60A',
    category: 'Monitori',
    price: 89999,
    quantity: 2,
    image: 'https://gigatron.rs/_next/image?url=https%3A%2F%2Fbackend.gigatron.rs%2Fmedia%2Fcatalog%2Fproduct%2Fcache%2Fd62e1a0582bf7257bddc609f302ce89c%2F8%2F6%2F8680096106743.jpg&w=2048&q=75',
  },
  {
    id: 3,
    name: 'APPLE iPhone 15 Pro Max 256GB',
    category: 'Pametni telefoni',
    price: 184999,
    quantity: 1,
    image: 'https://gigatron.rs/_next/image?url=https%3A%2F%2Fbackend.gigatron.rs%2Fmedia%2Fcatalog%2Fproduct%2Fcache%2Fd62e1a0582bf7257bddc609f302ce89c%2F8%2F6%2F8680096106743.jpg&w=2048&q=75',
  },
]

const CartPage = () => {
  const [items, setItems] = useState<CartItem[]>(mockCartItems)

  const removeItem = (id: number) => setItems((prev) => prev.filter((item) => item.id !== id))

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const fmt = (n: number) => n.toLocaleString('sr-RS')

  return (
    <div className='bg-neutral-100 min-h-screen py-10'>
      <div className='flex mx-auto max-w-[1200px] px-4 gap-6 items-start'>

        {/* Proizvodi */}
        <div className='bg-white border border-gray-100 flex-1 rounded-xl overflow-hidden'>
          <div className='px-6 py-4 border-b border-neutral-100'>
            <h2 className='text-lg font-semibold text-neutral-800'>Proizvodi u korpi</h2>
            <span className='text-sm text-gray-400'>{items.length} stavki</span>
          </div>

          {items.length === 0 ? (
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
                  <tr key={item.id} className='border-b border-neutral-50 last:border-0'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-4'>
                        <div className='w-14 h-14 rounded-lg bg-neutral-50 border border-neutral-100 shrink-0 overflow-hidden flex items-center justify-center p-1'>
                          <img src={item.image} alt={item.name} className='w-full h-full object-contain' />
                        </div>
                        <div className='flex flex-col'>
                          <span className='font-medium text-neutral-800'>{item.name}</span>
                          <span className='text-xs text-gray-400 mt-0.5'>{item.category}</span>
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
                          onClick={() => removeItem(item.id)}
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
            <button className='bg-red-500 py-1 px-3 rounded-md text-white cursor-pointer'>Ponisti korpu</button>
          </div>
        </div>

        {/* Summary */}
        <div className='bg-white border border-gray-100 w-80 shrink-0 rounded-xl p-6 flex flex-col gap-4'>
          <h2 className='text-lg font-semibold text-neutral-800'>Za plaćanje</h2>
          <div className='flex flex-col gap-2 text-sm text-neutral-600'>
            {items.map((item) => (
              <div key={item.id} className='flex justify-between'>
                <span className='truncate max-w-[160px] text-gray-400'>{item.name}</span>
                <span>{fmt(item.price * item.quantity)} RSD</span>
              </div>
            ))}
          </div>
          <div className='border-t border-neutral-100 pt-4 flex justify-between font-semibold text-neutral-800'>
            <span>Ukupno</span>
            <span>{fmt(total)} RSD</span>
          </div>
          <button className='w-full bg-yellow-400 hover:bg-yellow-500 transition-colors text-black font-semibold py-3 rounded-xl text-sm cursor-pointer'>
            Nastavi na plaćanje
          </button>
        </div>

      </div>
    </div>
  )
}

export default CartPage