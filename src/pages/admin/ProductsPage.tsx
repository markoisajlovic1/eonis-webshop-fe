import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductsSearch from '../../components/admin/ProductsSearch'
import { FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { IoIosAddCircleOutline } from "react-icons/io"
import { productService } from '../../services/productService'
import type { ProductDTO, ProductSort } from '../../types/product'

const PAGE_SIZE = 12

const SORT_MAP: Record<string, ProductSort> = {
  'Naziv A-Z': 'NameAsc',
  'Naziv Z-A': 'NameDesc',
  'Cena rastuće': 'PriceAsc',
  'Cena opadajuće': 'PriceDesc',
}

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductDTO[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Sve kategorije')
  const [subcategory, setSubcategory] = useState('Sve subkategorije')
  const [sort, setSort] = useState('Naziv A-Z')
  const [status, setStatus] = useState<'Draft' | 'Published'>('Published')
  const [view, setView] = useState<'Grid' | 'List'>('List')
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  const fetchProducts = useCallback(() => {
    setLoading(true)
    productService.filter({
      term: search.trim() || undefined,
      sort: SORT_MAP[sort] ?? 'NameAsc',
      isPublished: status === 'Published',
      pageNumber: page,
      pageSize: PAGE_SIZE,
    })
      .then((result) => {
        setProducts(result.items)
        setTotalCount(result.totalCount)
        setTotalPages(result.totalPages)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [search, sort, status, page])

  useEffect(() => {
    const timeout = setTimeout(fetchProducts, search ? 300 : 0)
    return () => clearTimeout(timeout)
  }, [fetchProducts, search])

  // Reset na prvu stranu ako se promene fiteri
  useEffect(() => {
    setPage(1)
  }, [search, sort, status, category, subcategory])

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className='flex items-center justify-between'>
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Proizvodi</h1>
          <span className="text-sm text-gray-400">{totalCount} proizvoda</span>
        </div>

        <button
          onClick={() => navigate('/admin/products/new')}
          className='bg-blue-500 px-5 py-1.5 text-white rounded-md cursor-pointer flex items-center gap-2'
        >
          <IoIosAddCircleOutline />
          Novi proizvod
        </button>
      </div>

      <ProductsSearch
        search={search} onSearchChange={setSearch}
        category={category} onCategoryChange={setCategory}
        subcategory={subcategory} onSubcategoryChange={setSubcategory}
        sort={sort} onSortChange={setSort}
        status={status} onStatusChange={setStatus}
        view={view} onViewChange={setView}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20 text-sm text-gray-400">
          Učitavanje...
        </div>
      ) : products.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-sm text-gray-400">
          Nema proizvoda u bazi
        </div>
      ) : view === 'Grid' ? (
        <div className="grid grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.productId} className="border rounded-xl p-4 bg-white">
              <h3 className="font-medium">{p.productName}</h3>
              <p className="text-sm text-gray-500">{p.subcategoryId}</p>
              <p className="font-semibold mt-2">{p.price.toLocaleString('sr-RS')} RSD</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-neutral-100 bg-neutral-50">
                <th className="px-6 py-3.5">Naziv</th>
                <th className="px-6 py-3.5">Cena</th>
                <th className="px-6 py-3.5">Na stanju</th>
                <th className="px-6 py-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.productId}
                  className=" hover:bg-neutral-50 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold">{product.productName}</td>
                  <td className="px-6 py-4">{product.price.toLocaleString('sr-RS')} RSD</td>
                  <td className="px-6 py-4">{product.quantity}</td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    <button className='cursor-pointer text-neutral-300 hover:text-black rounded-full' onClick={() => navigate(`/admin/products/${product.productId}`)}>
                      <FiEdit2 />
                    </button>
                    <button className='cursor-pointer text-neutral-300 hover:text-red-500 rounded-full' onClick={() => {}}>
                      <FiTrash2 />
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <FiChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer
                ${p === page
                  ? 'bg-blue-500 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

export default ProductsPage
