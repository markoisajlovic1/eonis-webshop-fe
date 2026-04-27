import { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { couponService } from '../services/couponService'
import type { CouponDTO } from '../types/coupon'

interface InsertProps {
  action: 'insert'
  onClose: () => void
  onSaved: (coupon: CouponDTO) => void
}

interface EditProps {
  action: 'edit'
  coupon: CouponDTO
  onClose: () => void
  onSaved: (coupon: CouponDTO) => void
}

type CouponDialogProps = InsertProps | EditProps

const CouponDialog = (props: CouponDialogProps) => {
  const { action, onClose, onSaved } = props

  const [code, setCode] = useState(action === 'edit' ? props.coupon.code : '')
  const [discount, setDiscount] = useState<number | ''>(action === 'edit' ? props.coupon.value : '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!code.trim() || discount === '') return
    setLoading(true)
    try {
      if (action === 'insert') {
        const created = await couponService.create({ code, value: Number(discount), userId: 'c0faa8de-6269-4984-a4d7-e3f9f5c1f6dd' })
        onSaved(created)
      } else {
        const updated = await couponService.update(props.coupon.codeId, { code, value: Number(discount), userId: props.coupon.userId })
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
          {action === 'edit' ? 'Izmeni kupon' : 'Novi kod'}
        </h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-neutral-600">Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="npr. SUMMER20"
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm outline-none focus:border-blue-400 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-neutral-600">Discount</label>
          <div className="relative">
            <input
              type="number"
              min={1}
              max={100}
              value={discount}
              onChange={(e) => setDiscount(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="0"
              className="w-full px-4 py-2.5 pr-8 border border-neutral-200 rounded-lg text-sm outline-none focus:border-blue-400 transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
          </div>
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

export default CouponDialog
