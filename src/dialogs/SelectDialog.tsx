import { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { FiSearch, FiCheck } from 'react-icons/fi'

export interface SelectDialogItem {
  id: string
  label: string
  sublabel?: string
  image?: string
}

interface SelectDialogProps {
  title: string
  items: SelectDialogItem[]
  selectedId: string | null
  onSelect: (id: string) => void
  onClose: () => void
}

const SelectDialog = ({ title, items, selectedId, onSelect, onClose }: SelectDialogProps) => {
  const [search, setSearch] = useState('')
  const [pendingId, setPendingId] = useState<string | null>(selectedId)

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = () => {
    if (pendingId) onSelect(pendingId)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-96 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <IoClose size={20} />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-neutral-100">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pretraži..."
              autoFocus
              className="w-full pl-8 pr-4 py-2 border border-neutral-200 rounded-lg text-sm outline-none focus:border-blue-400 transition-all"
            />
          </div>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-sm text-gray-400">
              Nema rezultata
            </div>
          ) : (
            filtered.map((item) => {
              const isSelected = item.id === pendingId
              return (
                <div
                  key={item.id}
                  onClick={() => setPendingId(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-neutral-50 last:border-0 ${
                    isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  {item.image !== undefined && (
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.label} className="w-full h-full object-contain p-1" />
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm block truncate ${isSelected ? 'text-blue-700 font-medium' : 'text-neutral-700'}`}>
                      {item.label}
                    </span>
                    {item.sublabel && (
                      <span className="text-xs text-gray-400 truncate block">{item.sublabel}</span>
                    )}
                  </div>
                  {isSelected && <FiCheck size={15} className="text-blue-500 shrink-0" />}
                </div>
              )
            })
          )}
        </div>

        <div className="px-4 py-3 border-t border-neutral-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Otkaži
          </button>
          <button
            onClick={handleSave}
            disabled={!pendingId}
            className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            Sačuvaj
          </button>
        </div>
      </div>
    </div>
  )
}

export default SelectDialog
