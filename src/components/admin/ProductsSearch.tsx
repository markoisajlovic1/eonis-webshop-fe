import { useState } from 'react'
import { FiSearch, FiChevronDown } from 'react-icons/fi'
import { IoGridOutline, IoListOutline } from 'react-icons/io5'

const CATEGORIES = ['Sve kategorije', 'Laptopovi', 'Desktopovi', 'Komponente', 'Periferni uređaji', 'Mreža i storage', 'Gaming oprema']

const STATUSES = ['Draft', 'Published'] as const
const VIEW_OPTIONS = [
  { value: 'Grid' as const, Icon: IoGridOutline },
  { value: 'List' as const, Icon: IoListOutline },
]

const SUBCATEGORIES: Record<string, string[]> = {
  'Sve kategorije': ['Sve subkategorije'],
  'Laptopovi': ['Sve subkategorije', 'Gaming laptopovi', 'Poslovni laptopovi', 'Ultrabook'],
  'Desktopovi': ['Sve subkategorije', 'Gaming PC', 'Poslovni PC', 'All-in-One'],
  'Komponente': ['Sve subkategorije', 'Procesori', 'Grafičke kartice', 'RAM memorija', 'Matične ploče', 'SSD / HDD'],
  'Periferni uređaji': ['Sve subkategorije', 'Monitori', 'Tastature', 'Miševi', 'Slušalice', 'Veb kamere'],
  'Mreža i storage': ['Sve subkategorije', 'Ruteri', 'Svičevi', 'Eksterni diskovi', 'NAS uređaji'],
  'Gaming oprema': ['Sve subkategorije', 'Gaming stolice', 'Gaming stolovi', 'Kontroleri', 'VR oprema'],
}

const SORT_OPTIONS = ['Najnovije', 'Najstarije', 'Cena rastuće', 'Cena opadajuće', 'Naziv A-Z']

interface ProductsSearchProps {
  search: string
  onSearchChange: (v: string) => void
  category: string
  onCategoryChange: (v: string) => void
  subcategory: string
  onSubcategoryChange: (v: string) => void
  sort: string
  onSortChange: (v: string) => void
  status: 'Draft' | 'Published'
  onStatusChange: (v: 'Draft' | 'Published') => void
  view: 'Grid' | 'List'
  onViewChange: (v: 'Grid' | 'List') => void
}

const Select = ({
  value,
  options,
  onChange,
}: {
  value: string
  options: string[]
  onChange: (v: string) => void
}) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-700 hover:border-neutral-300 transition-all min-w-44 justify-between cursor-pointer"
      >
        <span className="truncate">{value}</span>
        <FiChevronDown className={`text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-20 top-full mt-1 left-0 bg-white border border-neutral-100 rounded-lg shadow-lg py-1 min-w-full">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt)
                setOpen(false)
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 transition-colors cursor-pointer
                ${value === opt ? 'text-amber-500 font-medium' : 'text-neutral-700'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const ProductsSearch = ({
  search, onSearchChange,
  category, onCategoryChange,
  subcategory, onSubcategoryChange,
  sort, onSortChange,
  status, onStatusChange,
  view, onViewChange,
}: ProductsSearchProps) => {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Pretraži proizvode..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm placeholder:text-gray-400 outline-none focus:border-amber-400 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={category}
            options={CATEGORIES}
            onChange={(v) => {
              onCategoryChange(v)
              onSubcategoryChange('Sve subkategorije')
            }}
          />

          <Select
            value={subcategory}
            options={SUBCATEGORIES[category] ?? ['Sve subkategorije']}
            onChange={onSubcategoryChange}
          />

          <Select
            value={sort}
            options={SORT_OPTIONS}
            onChange={onSortChange}
          />
        </div>
      </div>

      {/* STATUS + VIEW */}
      <div className="flex items-center justify-between mt-3">

        {/* Draft / Published */}
        <div className="flex items-center bg-neutral-100 border border-neutral-200 rounded-lg p-[3px] gap-0.5">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={`flex items-center gap-1.5 px-3 py-[5px] rounded-md text-[13px] transition-all cursor-pointer
                ${status === s
                  ? 'bg-white border border-neutral-200 text-neutral-800 font-medium'
                  : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${s === 'Draft' ? 'bg-amber-400' : 'bg-green-500'}`} />
              {s}
            </button>
          ))}
        </div>

        {/* Grid / List */}
        <div className="flex items-center bg-neutral-100 border border-neutral-200 rounded-lg p-[3px] gap-0.5">
          {VIEW_OPTIONS.map(({ value, Icon }) => (
            <button
              key={value}
              onClick={() => onViewChange(value)}
              className={`flex items-center gap-1.5 px-3 py-[5px] rounded-md text-[13px] transition-all cursor-pointer
                ${view === value
                  ? 'bg-white border border-neutral-200 text-neutral-800 font-medium'
                  : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              <Icon size={16} />
              {value}
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}

export default ProductsSearch