import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductsSearch from '../../components/admin/ProductsSearch'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { IoIosAddCircleOutline } from "react-icons/io"
import { productService } from '../../services/productService'
import type { ProductDTO } from '../../types/product'

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Sve kategorije')
  const [subcategory, setSubcategory] = useState('Sve subkategorije')
  const [sort, setSort] = useState('Najnovije')
  const [status, setStatus] = useState<'Draft' | 'Published'>('Published')
  const [view, setView] = useState<'Grid' | 'List'>('List')
  const navigate = useNavigate()

  useEffect(() => {
    productService.getAll()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = [...products]

    if (search.trim()) {
      list = list.filter((p) =>
        p.productName.toLowerCase().includes(search.toLowerCase())
      )
    }

    return list
  }, [products, search, category, subcategory, sort, status])

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className='flex items-center justify-between'>
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Proizvodi</h1>
          <span className="text-sm text-gray-400">{filtered.length} proizvoda</span>
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
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-sm text-gray-400">
          Nema proizvoda u bazi
        </div>
      ) : view === 'Grid' ? (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((p) => (
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
              {filtered.map((product) => (
                <tr
                  key={product.productId}
                  onClick={() => navigate(`/admin/products/${product.productId}`)}
                  className="cursor-pointer hover:bg-neutral-50 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold">{product.productName}</td>
                  <td className="px-6 py-4">{product.price.toLocaleString('sr-RS')} RSD</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    <FiEdit2 />
                    <FiTrash2 />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ProductsPage
