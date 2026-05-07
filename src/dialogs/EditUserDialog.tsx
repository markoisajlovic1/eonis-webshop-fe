import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { usersService } from '../services/usersService'
import { toast } from 'react-toastify'
import type { UserDTO } from '../types/user'

interface EditUserDialogProps {
  user: UserDTO
  onClose: () => void
  onSaved: (updated: UserDTO) => void
}

interface FormState {
  username: string
  email: string
  firstName: string
  lastName: string
  phone: string
}

const toForm = (u: UserDTO): FormState => ({
  username: u.username,
  email: u.email,
  firstName: u.firstName,
  lastName: u.lastName,
  phone: u.phone,
})

const EditUserDialog: React.FC<EditUserDialogProps> = ({ user, onClose, onSaved }) => {
  const [form, setForm] = useState<FormState>(toForm(user))
  const [saving, setSaving] = useState(false)

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const isDirty = (Object.keys(form) as (keyof FormState)[]).some(k => form[k] !== toForm(user)[k])

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await usersService.update(user.userId, { ...form, role: user.role })
      toast.success('Korisnik uspešno ažuriran')
      onSaved(updated)
      onClose()
    } catch {
      toast.error('Greška pri čuvanju')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-800">Uredi korisnika</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-black transition-colors cursor-pointer">
            <FiX size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {([
            { label: 'Korisničko ime', field: 'username' },
            { label: 'Email', field: 'email' },
            { label: 'Ime', field: 'firstName' },
            { label: 'Prezime', field: 'lastName' },
            { label: 'Telefon', field: 'phone' },
          ] as { label: string; field: keyof FormState }[]).map(({ label, field }) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{label}</label>
              <input
                type="text"
                value={form[field]}
                onChange={set(field)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black transition-colors"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-neutral-600 hover:text-black transition-colors cursor-pointer"
          >
            Otkaži
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="px-4 py-2 text-sm font-semibold bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? 'Čuvanje...' : 'Sačuvaj'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditUserDialog
