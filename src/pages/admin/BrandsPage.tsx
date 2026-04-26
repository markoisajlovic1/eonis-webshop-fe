import { useState, useMemo } from 'react'
import { FiSearch } from 'react-icons/fi'
import { IoIosAddCircleOutline } from 'react-icons/io'
import BrandCard from '../../components/admin/BrandCard'

interface Brand {
  id: number
  name: string
  logo: string
}

const MOCK_BRANDS: Brand[] = [
  { id: 1, name: 'Apple', logo: 'https://gigatron.rs/shared-assets/images/brands/apple.svg' },
  { id: 2, name: 'Samsung', logo: 'https://gigatron.rs/shared-assets/images/brands/samsung.svg' },
  { id: 3, name: 'Lenovo', logo: 'https://gigatron.rs/shared-assets/images/brands/lenovo.svg' },
  { id: 4, name: 'Asus', logo: 'https://gigatron.rs/shared-assets/images/brands/asus.svg' },
  { id: 5, name: 'Dell', logo: 'https://gigatron.rs/shared-assets/images/brands/dell.svg' },
  { id: 6, name: 'HP', logo: 'https://gigatron.rs/shared-assets/images/brands/hp.svg' },
  { id: 7, name: 'MSI', logo: 'https://gigatron.rs/shared-assets/images/brands/msi.svg' },
  { id: 8, name: 'Acer', logo: 'https://gigatron.rs/shared-assets/images/brands/acer.svg' },
]

const SORT_OPTIONS = ['Naziv A-Z', 'Naziv Z-A']

const BrandsPage = () => {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('Naziv A-Z')

  const filtered = useMemo(() => {
    let list = [...MOCK_BRANDS]

    if (search.trim()) {
      list = list.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (sort === 'Naziv Z-A') {
      list.sort((a, b) => b.name.localeCompare(a.name))
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name))
    }

    return list
  }, [search, sort])

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Brendovi</h1>
          <span className="text-sm text-gray-400">{filtered.length} brendova</span>
        </div>
        <button className="bg-blue-500 px-5 py-1.5 text-white rounded-md cursor-pointer flex items-center gap-2">
          <IoIosAddCircleOutline />
          Dodaj brend
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Pretraži brendove..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm placeholder:text-gray-400 outline-none focus:border-amber-400 transition-all"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-700 outline-none cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-6 gap-4">
        {filtered.map((brand) => (
          <BrandCard key={brand.id} name={brand.name} logo={brand.logo} />
        ))}
      </div>
    </div>
  )
}

export default BrandsPage
