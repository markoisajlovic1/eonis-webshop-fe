import { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import type { CategoryDTO, SubcategoryDTO } from '../types/categories'
import { categoryService } from '../services/categoryService'

interface AddCategoryProps {
  action: 'insert'
  type: 'category'
  onClose: () => void
  onSaved: (category: CategoryDTO) => void
}

interface EditCategoryProps {
  action: 'edit'
  type: 'category'
  category: CategoryDTO
  onClose: () => void
  onSaved: (category: CategoryDTO) => void
}

interface AddSubcategoryProps {
  action: 'insert'
  type: 'subcategory'
  categoryId: string
  onClose: () => void
  onSaved: (subcategory: SubcategoryDTO) => void
}

interface EditSubcategoryProps {
  action: 'edit'
  type: 'subcategory'
  subcategory: SubcategoryDTO
  onClose: () => void
  onSaved: (subcategory: SubcategoryDTO) => void
}

type CategoryDialogProps =
  | AddCategoryProps
  | EditCategoryProps
  | AddSubcategoryProps
  | EditSubcategoryProps

const CategoryDialog = (props: CategoryDialogProps) => {
  const { action, type, onClose } = props

  const initialName =
    action === 'edit' && type === 'category'
      ? props.category.name
      : action === 'edit' && type === 'subcategory'
      ? props.subcategory.name
      : ''

  const [name, setName] = useState(initialName)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      if (type === 'category') {
        if (action === 'insert') {
          const created = await categoryService.createCategory({ name: name.trim() })
          ;(props as AddCategoryProps).onSaved(created)
        } else {
          const updated = await categoryService.updateCategory(
            (props as EditCategoryProps).category.categoryId,
            { name: name.trim() }
          )
          ;(props as EditCategoryProps).onSaved(updated)
        }
      } else {
        if (action === 'insert') {
          const created = await categoryService.createSubcategory({
            categoryId: (props as AddSubcategoryProps).categoryId,
            name: name.trim(),
          })
          ;(props as AddSubcategoryProps).onSaved(created)
        } else {
          const updated = await categoryService.updateSubcategory(
            (props as EditSubcategoryProps).subcategory.subcategoryId,
            { name: name.trim() }
          )
          ;(props as EditSubcategoryProps).onSaved(updated)
        }
      }
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const title =
    type === 'category'
      ? action === 'edit'
        ? 'Izmeni kategoriju'
        : 'Dodaj kategoriju'
      : action === 'edit'
      ? 'Izmeni subkategoriju'
      : 'Dodaj subkategoriju'

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-96 p-6 flex flex-col gap-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <IoClose size={22} />
        </button>

        <h2 className="text-lg font-semibold text-neutral-800">{title}</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-neutral-600">Naziv</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="Unesite naziv"
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-sm outline-none focus:border-blue-400 transition-all"
            autoFocus
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!name.trim() || loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          {loading ? 'Čuvanje...' : 'Sačuvaj'}
        </button>
      </div>
    </div>
  )
}

export default CategoryDialog
