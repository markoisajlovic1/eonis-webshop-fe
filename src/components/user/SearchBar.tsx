import { type ChangeEvent, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch } from "react-icons/fi";
import type { ProductDTO } from '../../types/product';

interface SearchBarProps {
  searchedProducts: ProductDTO[]
  onSearch: (term: string) => void
}

const SearchBar = ({ searchedProducts, onSearch }: SearchBarProps) => {
  const [term, setTerm] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value)
    onSearch(e.target.value)
    setOpen(true)
  }

  const handleBlur = () => {
    setTimeout(() => setOpen(false), 150)
  }

  return (
    <div className="flex-1 max-w-lg hidden md:block" ref={containerRef}>
      <div className="relative">
        <div className="bg-white rounded-full flex items-center">
          <input
            type="text"
            value={term}
            className="w-full pl-4 py-2 rounded-full text-sm outline-none transition-all border border-transparent"
            placeholder="Pretraži proizvode..."
            onChange={handleChange}
            onFocus={() => term.trim() && setOpen(true)}
            onBlur={handleBlur}
          />
          <button className='bg-yellow-500 rounded-full p-2.5 transition-colors hover:bg-yellow-400 cursor-pointer'>
            <FiSearch className='text-black' />
          </button>
        </div>

        {open && searchedProducts.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-neutral-100 overflow-hidden z-50">
            {searchedProducts.map((p) => (
              <Link
                key={p.productId}
                to={`/proizvodi/${p.productId}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-0"
              >
                
                <span className="flex-1 text-sm text-neutral-800 truncate">{p.productName}</span>
                <span className="text-sm font-semibold text-neutral-800 shrink-0">{p.price} RSD</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar