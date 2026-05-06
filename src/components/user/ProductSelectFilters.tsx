import React, { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

interface FilterOption {
  id: string
  label: string
}

interface ProductSelectFiltersProps {
  title: string
  options: FilterOption[]
  selected: string[]
  onChange: (selected: string[]) => void
}

const ProductSelectFilters: React.FC<ProductSelectFiltersProps> = ({ title, options, selected, onChange }) => {
  const [open, setOpen] = useState(false)

  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter(s => s !== id)
        : [...selected, id]
    )
  }

  return (
    <div className="bg-white px-6 py-2 rounded-md shadow-sm border border-neutral-100">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between font-bold text-neutral-800 cursor-pointer"
      >
        {title}
        {open ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
      </button>

      {open && (
        <div className="flex flex-col gap-3 mt-4">
          {options.length === 0 ? (
            <p className="text-xs text-neutral-400">Nema opcija</p>
          ) : (
            options.map(opt => (
              <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selected.includes(opt.id)}
                  onChange={() => toggle(opt.id)}
                  className="w-4 h-4 accent-black rounded cursor-pointer"
                />
                <span className="text-sm text-neutral-600 group-hover:text-black transition-colors">
                  {opt.label}
                </span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default ProductSelectFilters
