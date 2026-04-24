import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductsSearch from '../../components/admin/ProductsSearch'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

interface Product {
  id: number
  name: string
  category: string
  subcategory: string
  price: number
  stock: number
  createdAt: Date
  status: 'Draft' | 'Published'
}

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'ASUS ROG Strix G16', category: 'Laptopovi', subcategory: 'Gaming laptopovi', price: 189990, stock: 8, createdAt: new Date('2025-03-10'), status: 'Published' },
  { id: 2, name: 'Dell XPS 15', category: 'Laptopovi', subcategory: 'Poslovni laptopovi', price: 229990, stock: 5, createdAt: new Date('2025-03-15'), status: 'Draft' },
  { id: 3, name: 'Lenovo ThinkPad X1 Carbon', category: 'Laptopovi', subcategory: 'Ultrabook', price: 199990, stock: 12, createdAt: new Date('2025-02-20'), status: 'Published' },
  { id: 4, name: 'AMD Ryzen 9 7900X', category: 'Komponente', subcategory: 'Procesori', price: 49990, stock: 20, createdAt: new Date('2025-01-05'), status: 'Published' },
  { id: 5, name: 'NVIDIA RTX 4070 Ti', category: 'Komponente', subcategory: 'Grafičke kartice', price: 89990, stock: 6, createdAt: new Date('2025-01-12'), status: 'Draft' },
  { id: 6, name: 'Corsair Vengeance DDR5 32GB', category: 'Komponente', subcategory: 'RAM memorija', price: 14990, stock: 35, createdAt: new Date('2025-02-01'), status: 'Published' },
  { id: 7, name: 'Samsung 990 Pro 1TB NVMe', category: 'Komponente', subcategory: 'SSD / HDD', price: 12990, stock: 28, createdAt: new Date('2025-02-14'), status: 'Published' },
  { id: 8, name: 'LG UltraGear 27" 4K 144Hz', category: 'Periferni uređaji', subcategory: 'Monitori', price: 59990, stock: 9, createdAt: new Date('2025-03-01'), status: 'Draft' },
]

const ProductsPage = () => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Sve kategorije')
  const [subcategory, setSubcategory] = useState('Sve subkategorije')
  const [sort, setSort] = useState('Najnovije')

  const [status, setStatus] = useState<'Draft' | 'Published'>('Published')
  const [view, setView] = useState<'Grid' | 'List'>('Grid')
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    let list = [...MOCK_PRODUCTS]

    if (search.trim()) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category !== 'Sve kategorije') {
      list = list.filter((p) => p.category === category)
    }

    if (subcategory !== 'Sve subkategorije') {
      list = list.filter((p) => p.subcategory === subcategory)
    }

    list = list.filter((p) => p.status === status)

    switch (sort) {
      case 'Najstarije': list.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()); break
      case 'Cena rastuće': list.sort((a, b) => a.price - b.price); break
      case 'Cena opadajuće': list.sort((a, b) => b.price - a.price); break
      case 'Naziv A-Z': list.sort((a, b) => a.name.localeCompare(b.name)); break
      default: list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }

    return list
  }, [search, category, subcategory, sort, status])

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">Proizvodi</h1>
        <span className="text-sm text-gray-400">{filtered.length} proizvoda</span>
      </div>

      <ProductsSearch
        search={search} onSearchChange={setSearch}
        category={category} onCategoryChange={setCategory}
        subcategory={subcategory} onSubcategoryChange={setSubcategory}
        sort={sort} onSortChange={setSort}
        status={status} onStatusChange={setStatus}
        view={view} onViewChange={setView}
      />

      {/* CONDITIONAL VIEW */}
      {view === 'Grid' ? (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="border rounded-xl p-4 bg-white">
              <h3 className="font-medium">{p.name}</h3>
              <p className="text-sm text-gray-500">{p.category}</p>
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
                <th className="px-6 py-3.5">Kategorija</th>
                <th className="px-6 py-3.5">Cena</th>
                <th className="px-6 py-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  onClick={() => navigate(`/admin/products/${product.id}`)}
                  className="cursor-pointer hover:bg-neutral-50 transition-colors"
                >
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{product.price.toLocaleString('sr-RS')} RSD</td>
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