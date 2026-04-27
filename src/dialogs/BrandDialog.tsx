import { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { brandService } from '../services/brandService'
import type { BrandDTO } from '../types/brand'

interface InsertProps {
  action: 'insert'
  onClose: () => void
  onSaved: (brand: BrandDTO) => void
}

interface EditProps {
  action: 'edit'
  brand: BrandDTO
  onClose: () => void
  onSaved: (brand: BrandDTO) => void
}

type BrandDialogProps = InsertProps | EditProps

const BrandDialog = (props: BrandDialogProps) => {
  const { action, onClose, onSaved } = props

  const [brandName, setBrandName] = useState(action === 'edit' ? props.brand.brandName : '')
  const [brandImage, setBrandImage] = useState(action === 'edit' ? props.brand.brandImage : '')
  const [brandInfo, setBrandInfo] = useState(action === 'edit' ? props.brand.brandInfo : '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!brandName.trim()) return
    setLoading(true)
    try {
      if (action === 'insert') {
        const created = await brandService.create({ brandName, brandImage, brandInfo })
        onSaved(created)
      } else {
        const updated = await brandService.update(props.brand.brandId, { brandName, brandImage, brandInfo })
        onSaved(updated)
      }
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-96 p-6 flex flex-col gap-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <IoClose size={22} />
        </button>

        <h2 className="text-lg font-semibold text-neutral-800">
          {action === 'edit' ? 'Izmeni brend' : 'Dodaj brend'}
        </h2>

        <div className="flex flex-col items-center gap-4">
          <div className="h-24 w-24 rounded-full border-2 border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
            {brandImage ? (
              <img src={brandImage} alt="logo" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs text-gray-400 text-center px-2">Pregled</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm text-neutral-600">URL slike</label>
            <input
              type="text"
              value={brandImage}
              onChange={(e) => setBrandImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm outline-none focus:border-blue-400 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-neutral-600">Naziv</label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Unesite naziv brenda"
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm outline-none focus:border-blue-400 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-neutral-600">Informacije</label>
          <textarea
            value={brandInfo}
            onChange={(e) => setBrandInfo(e.target.value)}
            placeholder="Unesite informacije o brendu"
            rows={3}
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm outline-none focus:border-blue-400 transition-all resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          {loading ? 'Čuvanje...' : 'Sačuvaj'}
        </button>
      </div>
    </div>
  )
}

export default BrandDialog
