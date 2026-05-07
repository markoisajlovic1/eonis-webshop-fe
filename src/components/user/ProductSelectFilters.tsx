import React, { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

export interface FilterOption {
  id: string
  label: string
}

interface BaseProps {
  title: string
  options: FilterOption[]
  disabled?: boolean
  isLoading?: boolean
}

interface MultiProps extends BaseProps {
  mode?: 'multi'
  selected: string[]
  onChange: (selected: string[]) => void
}

interface SingleProps extends BaseProps {
  mode: 'single'
  selected: string | null
  onChange: (selected: string | null) => void
}

type ProductSelectFiltersProps = MultiProps | SingleProps

const ProductSelectFilters: React.FC<ProductSelectFiltersProps> = (props) => {
  const { title, options, disabled = false, isLoading = false } = props
  const [open, setOpen] = useState(false)

  const isChecked = (id: string): boolean => {
    if (props.mode === 'single') return props.selected === id
    return props.selected.includes(id)
  }

  const handleToggle = (id: string) => {
    if (disabled) return
    if (props.mode === 'single') {
      props.onChange(props.selected === id ? null : id)
    } else {
      const cur = props.selected
      props.onChange(cur.includes(id) ? cur.filter(s => s !== id) : [...cur, id])
    }
  }

  const selectedCount = props.mode === 'single'
    ? (props.selected ? 1 : 0)
    : props.selected.length

  return (
    <div className={`bg-white px-6 py-2 rounded-md shadow-sm border transition-colors ${disabled ? 'border-neutral-100 opacity-50' : 'border-neutral-100'}`}>
      <button
        onClick={() => !disabled && setOpen(v => !v)}
        disabled={disabled}
        className="w-full flex items-center justify-between font-bold text-neutral-800 py-2 disabled:cursor-not-allowed cursor-pointer"
      >
        <span className="flex items-center gap-2">
          {title}
          {selectedCount > 0 && (
            <span className="text-[10px] font-semibold bg-black text-white rounded-full px-1.5 py-0.5 leading-none">
              {selectedCount}
            </span>
          )}
        </span>
        {open ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
      </button>

      {open && !disabled && (
        <div className="flex flex-col gap-3 mt-2 mb-3 max-h-52 overflow-y-auto pr-1">
          {isLoading ? (
            <p className="text-xs text-neutral-400">Učitavanje...</p>
          ) : options.length === 0 ? (
            <p className="text-xs text-neutral-400">Nema opcija</p>
          ) : (
            options.map(opt => (
              <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type={props.mode === 'single' ? 'radio' : 'checkbox'}
                  checked={isChecked(opt.id)}
                  onChange={() => handleToggle(opt.id)}
                  className="w-4 h-4 accent-black cursor-pointer"
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
