import { useState } from 'react'
import { IoClose } from 'react-icons/io5'

export interface GuestUserInfoFormData {
  email: string
  postalCode: string
  streetName: string
  streetNumber: string
  city: string
  country: string
  floor: number
  doorNumber: string
}

interface GuestUserInfoDialogProps {
  isCashOnDelivery: boolean
  onConfirm: (data: GuestUserInfoFormData) => void
  onClose: () => void
}

const Field = ({
  label, value, onChange, placeholder, type = 'text', required = true,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-neutral-600">
      {label} {required && <span className='text-red-500'>*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-400 transition-colors"
    />
  </div>
)

const GuestUserInfoDialog = ({ isCashOnDelivery, onConfirm, onClose }: GuestUserInfoDialogProps) => {
  const [email, setEmail] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [streetName, setStreetName] = useState('')
  const [streetNumber, setStreetNumber] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [floor, setFloor] = useState('')
  const [doorNumber, setDoorNumber] = useState('')

  const isValid = email.trim() && postalCode.trim() && streetName.trim() && streetNumber.trim() && city.trim() && country.trim()

  const handleConfirm = () => {
    if (!isValid) return
    onConfirm({
      email: email.trim(),
      postalCode: postalCode.trim(),
      streetName: streetName.trim(),
      streetNumber: streetNumber.trim(),
      city: city.trim(),
      country: country.trim(),
      floor: parseInt(floor) || 0,
      doorNumber: doorNumber.trim(),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-125 p-6 flex flex-col gap-5 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <IoClose size={22} />
        </button>

        <div>
          <h2 className="text-lg font-semibold text-neutral-800">Podaci za dostavu</h2>
          <p className="text-sm text-gray-400 mt-0.5">Unesite kontakt i adresu na koju želite da primite paket</p>
        </div>

        <div className="flex flex-col gap-3">
          <Field label="Email adresa" value={email} onChange={setEmail} placeholder="npr. marko@email.com" type="email" />

          <hr className="border-neutral-100" />

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Field label="Ulica" value={streetName} onChange={setStreetName} placeholder="Naziv ulice" />
            </div>
            <Field label="Broj" value={streetNumber} onChange={setStreetNumber} placeholder="npr. 12" />
            <Field label="Poštanski broj" value={postalCode} onChange={setPostalCode} placeholder="npr. 11000" />
            <Field label="Sprat" value={floor} onChange={setFloor} placeholder="npr. 2" type="number" required={false} />
            <Field label="Broj stana" value={doorNumber} onChange={setDoorNumber} placeholder="npr. 4A" required={false} />
            <Field label="Grad" value={city} onChange={setCity} placeholder="npr. Beograd" />
            <Field label="Država" value={country} onChange={setCountry} placeholder="npr. Srbija" />
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-neutral-200 rounded-lg text-sm text-neutral-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Otkaži
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            className="flex-1 py-2.5 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold rounded-lg text-sm transition-colors cursor-pointer"
          >
            {isCashOnDelivery ? 'Poruči' : 'Završi plaćanje'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default GuestUserInfoDialog
