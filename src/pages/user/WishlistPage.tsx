import { useState, useEffect } from 'react'
import { FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { LuShoppingCart } from 'react-icons/lu'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import { wishlistService } from '../../services/wishlistService'
import type { ProductDTO } from '../../types/product'

const PAGE_SIZE = 5
const fmt = (n: number) => n.toLocaleString('sr-RS')

const WishlistPage = () => {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const [products, setProducts] = useState<ProductDTO[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [hasDiscount, setHasDiscount] = useState<boolean | undefined>(undefined)
  const [sortAZ, setSortAZ] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    setLoading(true)
    wishlistService.getByUserId(userId, {
      hasDiscount,
      sortAZ,
      pageNumber: page,
      pageSize: PAGE_SIZE,
    })
      .then(result => {
        setProducts(result.items)
        setTotalCount(result.totalCount)
        setTotalPages(result.totalPages)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [userId, hasDiscount, sortAZ, page])

  const removeItem = (productId: string) => {
    if (!userId) return
    wishlistService.remove(userId, productId)
      .then(() => setProducts(prev => prev.filter(p => p.productId !== productId)))
      .catch(console.error)
  }

  const handleDiscountFilter = (value: boolean | undefined) => {
    setHasDiscount(value)
    setPage(1)
  }

  const handleSortAZ = (value: boolean) => {
    setSortAZ(value)
    setPage(1)
  }

  return (
    <div className='bg-neutral-100 min-h-screen py-10'>
      <div className='max-w-300 mx-auto px-4'>
        <div className='mb-6 flex items-end justify-between'>
          <div>
            <h1 className='text-2xl font-semibold text-neutral-800'>Lista želja</h1>
            <p className='text-sm text-gray-400 mt-1'>{totalCount} stavki</p>
          </div>

          {/* Filters */}
          <div className='flex items-center gap-6'>
            {/* Discount radio */}
            <div className='flex items-center gap-3'>
              <span className='text-sm text-neutral-500'>Filter:</span>
              {([
                { label: 'Svi', value: undefined },
                { label: 'Na akciji', value: true },
              ] as { label: string; value: boolean | undefined }[]).map(opt => (
                <label key={opt.label} className='flex items-center gap-1.5 cursor-pointer text-sm'>
                  <input
                    type='radio'
                    name='discount'
                    checked={hasDiscount === opt.value}
                    onChange={() => handleDiscountFilter(opt.value)}
                    className='accent-black'
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            {/* Sort A-Z toggle */}
            <label className='flex items-center gap-2 cursor-pointer text-sm'>
              <input
                type='checkbox'
                checked={sortAZ}
                onChange={e => handleSortAZ(e.target.checked)}
                className='accent-black w-4 h-4'
              />
              Sortiraj A–Z
            </label>
          </div>
        </div>

        <div className='bg-white border border-gray-100 rounded-xl overflow-hidden'>
          {loading ? (
            <div className='flex items-center justify-center py-20 text-sm text-gray-400'>
              Učitavanje...
            </div>
          ) : products.length === 0 ? (
            <div className='flex items-center justify-center py-20 text-sm text-gray-400'>
              Lista želja je prazna
            </div>
          ) : (
            <table className='w-full text-sm'>
              <thead>
                <tr className='text-left text-xs text-gray-400 bg-neutral-50 border-b border-neutral-100'>
                  <th className='px-6 py-3'>Naziv proizvoda</th>
                  <th className='px-6 py-3'>Kategorija / Potkategorija</th>
                  <th className='px-6 py-3 text-right'>Cena</th>
                  <th className='px-6 py-3 text-right'>Akcije</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.productId} className='border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <span className='font-medium text-neutral-800'>{product.productName}</span>
                        {product.discount > 0 && (
                          <span className='text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded'>
                            -{product.discount}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-col'>
                        <span className='text-neutral-600'>{product.subcategory.categoryName}</span>
                        <span className='text-xs text-gray-400 mt-0.5'>{product.subcategory.subcategoryName}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <div className='flex flex-col items-end'>
                        <span className='font-semibold text-neutral-800'>{fmt(product.price)} RSD</span>
                        {product.discount > 0 && (
                          <span className='text-xs text-gray-400 line-through'>
                            {fmt(Math.round(product.price / (1 - product.discount / 100)))} RSD
                          </span>
                        )}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center justify-end gap-3'>
                        <button className='flex items-center gap-2 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer'>
                          <LuShoppingCart size={14} />
                          Dodaj u korpu
                        </button>
                        <button
                          onClick={() => removeItem(product.productId)}
                          className='text-gray-300 hover:text-red-500 transition-colors cursor-pointer'
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className='flex items-center justify-center gap-1 mt-6'>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className='p-2 rounded-lg text-neutral-500 hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer'
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
              className='p-2 rounded-lg text-neutral-500 hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer'
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage
