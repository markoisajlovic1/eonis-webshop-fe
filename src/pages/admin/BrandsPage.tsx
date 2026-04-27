import { useState, useMemo, useEffect } from 'react'
import { FiSearch } from 'react-icons/fi'
import { IoIosAddCircleOutline } from 'react-icons/io'
import BrandCard from '../../components/admin/BrandCard'
import BrandDialog from '../../dialogs/BrandDialog'
import ConfirmationDialog from '../../dialogs/ConfirmationDialog'
import { brandService } from '../../services/brandService'
import type { BrandDTO } from '../../types/brand'

const SORT_OPTIONS = ['Naziv A-Z', 'Naziv Z-A']

const BrandsPage = () => {
  const [brands, setBrands] = useState<BrandDTO[]>([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('Naziv A-Z')
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editBrand, setEditBrand] = useState<BrandDTO | null>(null)
  const [deleteBrand, setDeleteBrand] = useState<BrandDTO | null>(null)

  useEffect(() => {
    brandService.getAll().then(setBrands).catch(console.error)
  }, [])

  const handleDelete = () => {
    if (!deleteBrand) return
    brandService.delete(deleteBrand.brandId)
      .then(() => {
        setBrands((prev) => prev.filter((b) => b.brandId !== deleteBrand.brandId))
        setDeleteBrand(null)
      })
      .catch(console.error)
  }

  const filtered = useMemo(() => {
    let list = [...brands]

    if (search.trim()) {
      list = list.filter((b) =>
        b.brandName.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (sort === 'Naziv Z-A') {
      list.sort((a, b) => b.brandName.localeCompare(a.brandName))
    } else {
      list.sort((a, b) => a.brandName.localeCompare(b.brandName))
    }

    return list
  }, [brands, search, sort])

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Brendovi</h1>
          <span className="text-sm text-gray-400">{filtered.length} brendova</span>
        </div>
        <button
          onClick={() => setAddDialogOpen(true)}
          className="bg-blue-500 px-5 py-1.5 text-white rounded-md cursor-pointer flex items-center gap-2"
        >
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
          <BrandCard
            key={brand.brandId}
            name={brand.brandName}
            logo={brand.brandImage}
            onEdit={() => setEditBrand(brand)}
            onDelete={() => setDeleteBrand(brand)}
          />
        ))}
      </div>

      {addDialogOpen && (
        <BrandDialog
          action="insert"
          onClose={() => setAddDialogOpen(false)}
          onSaved={(brand) => setBrands((prev) => [...prev, brand])}
        />
      )}

      {editBrand && (
        <BrandDialog
          action="edit"
          brand={editBrand}
          onClose={() => setEditBrand(null)}
          onSaved={(updated) => setBrands((prev) => prev.map((b) => b.brandId === updated.brandId ? updated : b))}
        />
      )}

      {deleteBrand && (
        <ConfirmationDialog
          title="Obriši brend"
          text={`Da li ste sigurni da želite da obrišete brend "${deleteBrand.brandName}"?`}
          onConfirm={handleDelete}
          onClose={() => setDeleteBrand(null)}
        />
      )}
    </div>
  )
}

//https://app.diagrams.net/?src=about#G14sj6FCBAQhyGZW9KX74KD73x8I5Sr1sv#%7B%22pageId%22%3A%22PHYEedAWp7XTAr94eW8Z%22%7D

export default BrandsPage
