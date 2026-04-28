import { useState } from 'react'
import { IoClose } from 'react-icons/io5'

interface ProductImageDialogProps {
  onSave: (url: string) => void
  onClose: () => void
}

const ProductImageDialog = ({ onSave, onClose }: ProductImageDialogProps) => {
  const [url, setUrl] = useState('')

  const handleSave = () => {
    if (!url.trim()) return
    onSave(url.trim())
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-96 p-6 flex flex-col gap-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <IoClose size={20} />
        </button>

        <h2 className="text-sm font-semibold text-neutral-800">Dodaj sliku</h2>

        <div className="w-full h-44 rounded-lg border border-neutral-200 bg-neutral-50 flex items-center justify-center overflow-hidden">
          {url.trim() ? (
            <img
              src={url}
              alt="preview"
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <span className="text-xs text-gray-400">Preview slike</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">URL slike</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="https://..."
            autoFocus
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm outline-none focus:border-blue-400 transition-all"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!url.trim()}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          Sačuvaj
        </button>
      </div>
    </div>
  )
}

export default ProductImageDialog
