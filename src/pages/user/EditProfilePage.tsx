import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import { usersService } from '../../services/usersService'
import { addressService } from '../../services/addressService'
import type { UserDetailsDTO } from '../../types/user'
import type { AddressDTO } from '../../types/address'
import { FiMapPin, FiPlus, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify'

const MAX_ADDRESSES = 3

const AddressCard = ({ address, onDelete }: { address: AddressDTO; onDelete: (id: string) => void }) => (
  <div className="bg-white shadow-md border-neutral-200  p-4 flex items-start justify-between gap-4">
    <div className="flex gap-3 items-start">
      <FiMapPin className="text-yellow-500 mt-0.5 shrink-0" size={18} />
      <div className="text-sm text-neutral-700 leading-relaxed">
        <p className="font-medium">{address.streetName} {address.streetNumber}{address.floor ? `, sprat ${address.floor}` : ''}{address.doorNumber ? `, stan ${address.doorNumber}` : ''}</p>
        <p className="text-gray-400">{address.postalCode} {address.city}, {address.country}</p>
      </div>
    </div>
    <button
      onClick={() => onDelete(address.addressId)}
      className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer shrink-0 mt-0.5"
    >
      <FiTrash2 size={16} />
    </button>
  </div>
)

interface ProfileFormState {
  firstName: string
  lastName: string
  username: string
  email: string
  phone: string
}

interface AddressFormState {
  postalCode: string
  streetName: string
  streetNumber: string
  city: string
  country: string
  floor: string
  doorNumber: string
}

const detailsToForm = (d: UserDetailsDTO): ProfileFormState => ({
  firstName: d.firstName,
  lastName: d.lastName,
  username: d.username,
  email: d.email,
  phone: d.phone,
})

const emptyAddressForm = (): AddressFormState => ({
  postalCode: '', streetName: '', streetNumber: '', city: '', country: '', floor: '', doorNumber: '',
})

const EditProfilePage = () => {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const [details, setDetails] = useState<UserDetailsDTO | null>(null)
  const [profileForm, setProfileForm] = useState<ProfileFormState | null>(null)
  const [addresses, setAddresses] = useState<AddressDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [addressForm, setAddressForm] = useState<AddressFormState>(emptyAddressForm())
  const [addressSaving, setAddressSaving] = useState(false)

  const loadDetails = () => {
    if (!userId) return
    setLoading(true)
    usersService.getUserDetails(userId)
      .then(d => {
        setDetails(d)
        setProfileForm(detailsToForm(d))
        setAddresses(d.addresses)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadDetails() }, [userId])

  const isDirty = details && profileForm && (
    profileForm.firstName !== details.firstName ||
    profileForm.lastName !== details.lastName ||
    profileForm.username !== details.username ||
    profileForm.email !== details.email ||
    profileForm.phone !== details.phone
  )

  const handleReset = () => loadDetails()

  const handleSave = () => {
    if (!userId || !profileForm || !details) return
    setSaving(true)
    usersService.update(userId, {
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      username: profileForm.username,
      email: profileForm.email,
      phone: profileForm.phone,
      role: details.role,
    })
      .then(updated => {
        setDetails(prev => prev ? { ...prev, ...updated } : prev)
        setProfileForm(detailsToForm({ ...details, ...updated }))
        toast.success('Profil uspešno ažuriran.')
      })
      .catch(() => toast.error('Greška pri čuvanju profila.'))
      .finally(() => setSaving(false))
  }

  const handleDeleteAddress = (addressId: string) => {
    addressService.delete(addressId)
      .then(() => setAddresses(prev => prev.filter(a => a.addressId !== addressId)))
      .catch(console.error)
  }

  const isAddressFormValid = addressForm.postalCode.trim() && addressForm.streetName.trim() && addressForm.streetNumber.trim() && addressForm.city.trim() && addressForm.country.trim()

  const handleAddAddress = () => {
    if (!isAddressFormValid || !userId) return
    setAddressSaving(true)
    addressService.create({
      postalCode: addressForm.postalCode.trim(),
      streetName: addressForm.streetName.trim(),
      streetNumber: addressForm.streetNumber.trim(),
      city: addressForm.city.trim(),
      country: addressForm.country.trim(),
      floor: parseInt(addressForm.floor) || 0,
      doorNumber: addressForm.doorNumber.trim(),
      userId,
    })
      .then(newAddress => {
        setAddresses(prev => [...prev, newAddress])
        setAddressForm(emptyAddressForm())
        setShowAddForm(false)
      })
      .catch(console.error)
      .finally(() => setAddressSaving(false))
  }

  const profileField = (label: string, key: keyof ProfileFormState, type = 'text') => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-neutral-500">{label}</label>
      <input
        type={type}
        value={profileForm?.[key] ?? ''}
        onChange={e => setProfileForm(prev => prev ? { ...prev, [key]: e.target.value } : prev)}
        className="px-3 py-2.5 border border-neutral-200 rounded-lg text-sm outline-none focus:border-yellow-400 transition-colors bg-white"
      />
    </div>
  )

  const addressField = (label: string, key: keyof AddressFormState, placeholder?: string, type = 'text') => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-neutral-600">{label}</label>
      <input
        type={type}
        value={addressForm[key]}
        onChange={e => setAddressForm(prev => ({ ...prev, [key]: e.target.value }))}
        placeholder={placeholder}
        className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-400 transition-colors"
      />
    </div>
  )

  if (loading) {
    return <div className="p-8 text-sm text-gray-400">Učitavanje...</div>
  }

  if (!details || !profileForm) {
    return <div className="p-8 text-sm text-red-400">Greška pri učitavanju profila.</div>
  }

  return (
    <div className="p-8 flex flex-col gap-8">
      {/* User info */}
      <div>
        <h1 className="text-2xl font-bold mb-6 text-black">Moj profil</h1>
        <div className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            {profileField('Ime', 'firstName')}
            {profileField('Prezime', 'lastName')}
            {profileField('Korisničko ime', 'username')}
            {profileField('Broj telefona', 'phone', 'tel')}
            <div className="col-span-2">{profileField('Email', 'email', 'email')}</div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleReset}
              disabled={saving}
              className="px-4 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-40"
            >
              Vrati na početno stanje
            </button>
            <button
              onClick={handleSave}
              disabled={!isDirty || saving}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold rounded-lg text-sm transition-colors cursor-pointer"
            >
              {saving ? 'Čuvanje...' : 'Sačuvaj promene'}
            </button>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-800">Adrese dostave</h2>
            <p className="text-xs text-gray-400 mt-0.5">{addresses.length} / {MAX_ADDRESSES} adrese</p>
          </div>
          {addresses.length < MAX_ADDRESSES && (
            <button
              onClick={() => setShowAddForm(v => !v)}
              className="flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:text-black border border-neutral-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <FiPlus size={15} />
              Dodaj adresu
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {addresses.length === 0 && !showAddForm && (
            <p className="text-sm text-gray-400">Nemate sačuvanih adresa.</p>
          )}
          {addresses.map(a => (
            <AddressCard key={a.addressId} address={a} onDelete={handleDeleteAddress} />
          ))}
        </div>

        {showAddForm && (
          <div className="mt-4 bg-white border border-neutral-200 rounded-xl p-5 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-neutral-700">Nova adresa</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">{addressField('Ulica *', 'streetName', 'Naziv ulice')}</div>
              {addressField('Broj *', 'streetNumber', 'npr. 12')}
              {addressField('Poštanski broj *', 'postalCode', 'npr. 11000')}
              {addressField('Sprat', 'floor', 'npr. 2', 'number')}
              {addressField('Broj stana', 'doorNumber', 'npr. 4A')}
              {addressField('Grad *', 'city', 'npr. Beograd')}
              {addressField('Država *', 'country', 'npr. Srbija')}
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => { setShowAddForm(false); setAddressForm(emptyAddressForm()) }}
                className="flex-1 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Otkaži
              </button>
              <button
                onClick={handleAddAddress}
                disabled={!isAddressFormValid || addressSaving}
                className="flex-1 py-2 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold rounded-lg text-sm transition-colors cursor-pointer"
              >
                {addressSaving ? 'Čuvanje...' : 'Sačuvaj adresu'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EditProfilePage
