import { useState, useEffect, useRef } from 'react'
import { FiMapPin, FiTrash2 } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store/store'
import { cartService } from '../../services/cartService/cartService'
import { cartServiceLS } from '../../services/cartService/cartServiceLS'
import { productService } from '../../services/productService'
import { paymentService } from '../../services/paymentService'
import { couponService } from '../../services/couponService'
import { usersService } from '../../services/usersService'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { decrement, clearCart as clearCartCount } from '../../store/slices/cartSlice'
import GuestUserInfoDialog from '../../dialogs/GuestUserInfoDialog'
import type { GuestUserInfoFormData } from '../../dialogs/GuestUserInfoDialog'
import type { AddressDTO } from '../../types/address'

type PaymentMethod = 'card' | 'cash'

interface CartRow {
  productId: string
  name: string
  category: string
  price: number
  quantity: number
  stock: number
  image: string
}

const fmt = (n: number) => n.toLocaleString('sr-RS')

const CartPage = () => {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const dispatch = useDispatch<AppDispatch>();
  const [items, setItems] = useState<CartRow[]>([])
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [addressDialogOpen, setAddressDialogOpen] = useState(false)
  const [userAddresses, setUserAddresses] = useState<AddressDTO[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

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
                stock: p.quantity,
                image: p.images[0]?.imageLink ?? '',
              }))
            )
          )
        )
        .then(setItems)
        .catch(console.error)
        .finally(() => setLoading(false))

      // da bi dobio info o userovim adresama
      usersService.getUserDetails(userId)
        .then(details => {
          setUserEmail(details.email)
          setUserAddresses(details.addresses)
          if (details.addresses.length > 0) {
            setSelectedAddressId(details.addresses[0].addressId)
          }
        })
        .catch(console.error)
    } else {
      Promise.resolve(cartServiceLS.getAll()).then(lsItems => {
        setItems(lsItems.map(i => ({
          productId: i.productId,
          name: i.productName,
          category: '',
          price: i.price,
          quantity: i.quantity,
          stock: Infinity,
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
    // brisanje iz reduxa
    dispatch(decrement())
  }

  const clearCart = () => {
    if (userId) {
      items.forEach(i => cartService.remove(userId, i.productId).catch(console.error))
    } else {
      cartServiceLS.clear()
    }
    setItems([])
    // brisanje iz reduxa
    dispatch(clearCartCount())
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handlePay = () => {
    if (items.length === 0) return
    const cartItems = items.map(i => ({ productId: i.productId, quantity: i.quantity }))

    if (!userId || paymentMethod === 'cash') {
      setAddressDialogOpen(true)
      return
    }

    // logged in, card payment — send selected addressId and email
    paymentService.createCheckoutSession({
      userId,
      addressId: selectedAddressId,
      email: userEmail,
      items: cartItems,
      couponCode: appliedDiscount > 0 ? couponCode.trim() : null,
    })
      .then(result => { window.location.href = result.url })
      .catch(console.error)
  }

  const handleGuestConfirm = (data: GuestUserInfoFormData) => {
    setAddressDialogOpen(false)
    const cartItems = items.map(i => ({ productId: i.productId, quantity: i.quantity }))
    const { email, ...address } = data
    if (paymentMethod === 'cash') {
      paymentService.cashPayment({
        userId: userId ?? null,
        addressId: null,
        email,
        items: cartItems,
        address,
        couponCode: appliedDiscount > 0 ? couponCode.trim() : null,
      })
        .then(() => toast.success('Porudžbina uspešno poslata!'))
        .catch(console.error)
    } else {
      paymentService.createCheckoutSession({
        userId: userId ?? null,
        addressId: null,
        email,
        items: cartItems,
        address,
        couponCode: appliedDiscount > 0 ? couponCode.trim() : null,
      })
        .then(result => { window.location.href = result.url })
        .catch(console.error)
    }
  }

  const quantityDebounceRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const updateQuantity = (productId: string, newQty: number) => {
    if (newQty < 1) return
    const item = items.find(i => i.productId === productId)
    if (item && newQty > item.stock) return
    setItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity: newQty } : i))

    if (quantityDebounceRef.current[productId]) {
      clearTimeout(quantityDebounceRef.current[productId])
    }

    // debounce da ne moze da se spamuje 
    quantityDebounceRef.current[productId] = setTimeout(() => {
      // ulogovani opet updateuje cart u db
      // neulogovani update u LS
      if (userId) {
        cartService.update(userId, productId, { quantity: newQty }).catch(console.error)
      } else {
        cartServiceLS.update(productId, newQty)
      }
    }, 500)
  }

  const [couponCode, setCouponCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0)

  const handleApplyCoupon = () => {
    const code = couponCode.trim()
    if (!code || !userId) return
    couponService.checkUsedByUser(code, userId)
      .then(result => {
        if (result.isUsed) {
          toast.error('Kod je već iskorišćen.')
        } else {
          setAppliedDiscount(result.value)
          toast.success('Popust primenjen.')
        }
      })
      .catch(() => toast.error('Kupon kod nije pronađen.'))
  }

  const isCash = paymentMethod === 'cash'
  const actionLabel = isCash ? 'Poruči' : 'Nastavi na plaćanje'

  return (
    <div className='bg-neutral-100 min-h-screen py-10'>
      <div className='flex mx-auto max-w-[1200px] px-4 gap-6 items-start'>
        
        <div className='w-[1200px] flex flex-col gap-4'>
          

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
                        <div className='inline-flex items-center gap-1'>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className='w-7 h-7 rounded-md bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-700 font-bold text-base flex items-center justify-center cursor-pointer transition-colors'
                          >−</button>
                          <input
                            type='number'
                            min={1}
                            value={item.quantity}
                            onChange={e => updateQuantity(item.productId, Math.max(1, parseInt(e.target.value) || 1))}
                            className='w-10 text-center text-sm font-medium text-neutral-800 bg-neutral-100 rounded-md py-1 outline-none focus:ring-1 focus:ring-yellow-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                          />
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className='w-7 h-7 rounded-md bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-700 font-bold text-base flex items-center justify-center cursor-pointer transition-colors'
                          >+</button>
                        </div>
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
              <Link to={'/'} className='py-1 px-3 rounded-md border border-gray-300 cursor-pointer'>Vrati se na pocetnu</Link>
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

          {/* Adrese dostave */}
          {userId && userAddresses.length > 0 && (
            <div className='bg-white p-4 flex flex-col gap-3 rounded-md'>
              <h3 className='font-semibold'>Adresa dostave</h3>
              <div className='flex flex-col gap-2'>
                {userAddresses.map(addr => (
                  <label
                    key={addr.addressId}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedAddressId === addr.addressId
                        ? 'border-yellow-400 bg-yellow-50'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <input
                      type='radio'
                      name='deliveryAddress'
                      value={addr.addressId}
                      checked={selectedAddressId === addr.addressId}
                      onChange={() => {
                        if (userAddresses.length > 1) setSelectedAddressId(addr.addressId)
                      }}
                      disabled={userAddresses.length === 1}
                      className='accent-yellow-400 mt-0.5 cursor-pointer'
                    />
                    <div className='flex items-start gap-2 min-w-0'>
                      <FiMapPin className='text-yellow-500 mt-0.5 shrink-0' size={14} />
                      <div className='text-sm text-neutral-700 leading-snug'>
                        <p className='font-medium'>{addr.streetName} {addr.streetNumber}{addr.floor ? `, sp. ${addr.floor}` : ''}{addr.doorNumber ? `, st. ${addr.doorNumber}` : ''}</p>
                        <p className='text-xs text-gray-400'>{addr.postalCode} {addr.city}, {addr.country}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        

        {/* Summary */}
        <div className='flex flex-col gap-4'>

          {/* Kupon */}
          {userId && (
            <div className='bg-white p-4 flex flex-col gap-4 rounded-md'>
              <h3 className='font-semibold'>Iskoristi kod</h3>
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  placeholder='Unesite kod...'
                  className='flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-400 transition-colors'
                />
                <button
                  onClick={handleApplyCoupon}
                  className='px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap'
                >
                  Primeni
                </button>
              </div>
            </div>
          )}

          

          {/* SUmmary */}
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

            {appliedDiscount > 0 && (
              <div className='flex justify-between text-sm text-green-600'>
                <span>Popust ({appliedDiscount}%)</span>
                <span>- {fmt(total * appliedDiscount / 100)} RSD</span>
              </div>
            )}
            <div className='border-t border-neutral-100 pt-4 flex justify-between font-semibold text-neutral-800'>
              <span>Ukupno</span>
              <span>{fmt(total * (1 - appliedDiscount / 100))} RSD</span>
            </div>

            {/* Način plaćanja */}
            <div className='flex flex-col gap-2'>
              <span className='text-xs font-medium text-neutral-500 uppercase tracking-wide'>Način plaćanja</span>
              <div className='flex flex-col gap-2'>
                {([
                  { value: 'card', label: 'Kartica (online)' },
                  { value: 'cash', label: 'Pouzećem' },
                ] as { value: PaymentMethod; label: string }[]).map(opt => (
                  <label
                    key={opt.value}
                    className='flex items-center gap-2.5 cursor-pointer group'
                  >
                    <input
                      type='radio'
                      name='paymentMethod'
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value)}
                      className='accent-yellow-400 w-4 h-4 cursor-pointer'
                    />
                    <span className='text-sm text-neutral-700'>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={items.length === 0}
              className='w-full bg-yellow-400 hover:bg-yellow-500 transition-colors text-black font-semibold py-3 rounded-xl text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {actionLabel}
            </button>
          </div>

        </div>

      </div>

      {addressDialogOpen && (
        <GuestUserInfoDialog
          isCashOnDelivery={isCash}
          onConfirm={handleGuestConfirm}
          onClose={() => setAddressDialogOpen(false)}
        />
      )}
    </div>
  )
}

export default CartPage
