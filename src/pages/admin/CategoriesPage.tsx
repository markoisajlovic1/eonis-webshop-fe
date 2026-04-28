import { useState, useEffect } from 'react'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { MdChevronRight } from 'react-icons/md'
import type { CategoryDTO, SubcategoryDTO } from '../../types/categories'
import { categoryService } from '../../services/categoryService'
import CategoryDialog from '../../dialogs/CategoryDialog'
import ConfirmationDialog from '../../dialogs/ConfirmationDialog'

const CategoriesPage = () => {
  const [categories, setCategories] = useState<CategoryDTO[]>([])
  const [subcategories, setSubcategories] = useState<SubcategoryDTO[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingSubcategories, setLoadingSubcategories] = useState(false)

  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<CategoryDTO | null>(null)
  const [deleteCategory, setDeleteCategory] = useState<CategoryDTO | null>(null)

  const [addSubcategoryOpen, setAddSubcategoryOpen] = useState(false)
  const [editSubcategory, setEditSubcategory] = useState<SubcategoryDTO | null>(null)
  const [deleteSubcategory, setDeleteSubcategory] = useState<SubcategoryDTO | null>(null)

  useEffect(() => {
    categoryService.getAllCategories()
      .then((data) => {
        setCategories(data)
        if (data.length > 0) setSelectedCategoryId(data[0].categoryId)
      })
      .catch(console.error)
      .finally(() => setLoadingCategories(false))
  }, [])

  useEffect(() => {
    if (!selectedCategoryId) return
    setLoadingSubcategories(true)
    categoryService.getSubcategoriesByCategoryId(selectedCategoryId)
      .then(setSubcategories)
      .catch(console.error)
      .finally(() => setLoadingSubcategories(false))
  }, [selectedCategoryId])

  const selectedCategory = categories.find((c) => c.categoryId === selectedCategoryId) ?? null

  const handleSelectCategory = (id: string) => {
    setSelectedCategoryId(id)
    setSubcategories([])
  }

  const handleDeleteCategory = () => {
    if (!deleteCategory) return
    categoryService.deleteCategory(deleteCategory.categoryId)
      .then(() => {
        const remaining = categories.filter((c) => c.categoryId !== deleteCategory.categoryId)
        setCategories(remaining)
        if (selectedCategoryId === deleteCategory.categoryId) {
          const next = remaining[0]?.categoryId ?? null
          setSelectedCategoryId(next)
          setSubcategories([])
        }
        setDeleteCategory(null)
      })
      .catch(console.error)
  }

  const handleDeleteSubcategory = () => {
    if (!deleteSubcategory) return
    categoryService.deleteSubcategory(deleteSubcategory.subcategoryId)
      .then(() => {
        setSubcategories((prev) =>
          prev.filter((s) => s.subcategoryId !== deleteSubcategory.subcategoryId)
        )
        setDeleteSubcategory(null)
      })
      .catch(console.error)
  }

  return (
    <div className="p-8 flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">Kategorije</h1>
        <span className="text-sm text-gray-400">{categories.length} kategorija</span>
      </div>

      <div className="flex gap-6 flex-1 min-h-0" style={{ height: 'calc(100vh - 180px)' }}>
        {/* Kategorije - leva strana */}
        <div className="w-72 flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
            <span className="text-sm font-semibold text-neutral-700">Kategorije</span>
            <button
              onClick={() => setAddCategoryOpen(true)}
              className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <IoIosAddCircleOutline size={16} />
              Dodaj
            </button>
          </div>
          <div className="overflow-y-auto flex-1">
            {loadingCategories ? (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">
                Učitavanje...
              </div>
            ) : categories.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">
                Nema kategorija
              </div>
            ) : (
              categories.map((category) => {
                const isSelected = category.categoryId === selectedCategoryId
                return (
                  <div
                    key={category.categoryId}
                    onClick={() => handleSelectCategory(category.categoryId)}
                    className={`group flex items-center justify-between px-4 py-3 cursor-pointer transition-colors border-b border-neutral-50 last:border-0 ${
                      isSelected
                        ? 'bg-blue-50 border-l-2 border-l-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MdChevronRight
                        size={16}
                        className={`shrink-0 transition-colors ${
                          isSelected ? 'text-blue-500' : 'text-gray-300'
                        }`}
                      />
                      <span
                        className={`text-sm truncate ${
                          isSelected ? 'text-blue-700 font-medium' : 'text-neutral-700'
                        }`}
                      >
                        {category.name}
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setEditCategory(category)}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer rounded"
                      >
                        <FiEdit2 size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteCategory(category)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer rounded"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Subkategorije - desna strana */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100">
            <span className="text-sm font-semibold text-neutral-700">
              {selectedCategory
                ? `Subkategorije — ${selectedCategory.name}`
                : 'Subkategorije'}
            </span>
            {selectedCategory && (
              <button
                onClick={() => setAddSubcategoryOpen(true)}
                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <IoIosAddCircleOutline size={16} />
                Dodaj
              </button>
            )}
          </div>
          <div className="overflow-y-auto flex-1">
            {!selectedCategory ? (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">
                Izaberite kategoriju
              </div>
            ) : loadingSubcategories ? (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">
                Učitavanje...
              </div>
            ) : subcategories.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">
                Nema subkategorija za ovu kategoriju
              </div>
            ) : (
              subcategories.map((sub) => (
                <div
                  key={sub.subcategoryId}
                  className="flex items-center justify-between px-5 py-3 border-b border-neutral-50 last:border-0 hover:bg-gray-50 group"
                >
                  <span className="text-sm text-neutral-700">{sub.name}</span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditSubcategory(sub)}
                      className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer rounded"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteSubcategory(sub)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer rounded"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {addCategoryOpen && (
        <CategoryDialog
          action="insert"
          type="category"
          onClose={() => setAddCategoryOpen(false)}
          onSaved={(cat) => setCategories((prev) => [...prev, cat])}
        />
      )}

      {editCategory && (
        <CategoryDialog
          action="edit"
          type="category"
          category={editCategory}
          onClose={() => setEditCategory(null)}
          onSaved={(updated) =>
            setCategories((prev) =>
              prev.map((c) => (c.categoryId === updated.categoryId ? updated : c))
            )
          }
        />
      )}

      {deleteCategory && (
        <ConfirmationDialog
          title="Obriši kategoriju"
          text={`Da li ste sigurni da želite da obrišete kategoriju "${deleteCategory.name}"? Sve subkategorije će biti obrisane.`}
          onConfirm={handleDeleteCategory}
          onClose={() => setDeleteCategory(null)}
        />
      )}

      {addSubcategoryOpen && selectedCategoryId && (
        <CategoryDialog
          action="insert"
          type="subcategory"
          categoryId={selectedCategoryId}
          onClose={() => setAddSubcategoryOpen(false)}
          onSaved={(sub) => setSubcategories((prev) => [...prev, sub])}
        />
      )}

      {editSubcategory && (
        <CategoryDialog
          action="edit"
          type="subcategory"
          subcategory={editSubcategory}
          onClose={() => setEditSubcategory(null)}
          onSaved={(updated) =>
            setSubcategories((prev) =>
              prev.map((s) =>
                s.subcategoryId === updated.subcategoryId ? updated : s
              )
            )
          }
        />
      )}

      {deleteSubcategory && (
        <ConfirmationDialog
          title="Obriši subkategoriju"
          text={`Da li ste sigurni da želite da obrišete subkategoriju "${deleteSubcategory.name}"?`}
          onConfirm={handleDeleteSubcategory}
          onClose={() => setDeleteSubcategory(null)}
        />
      )}
    </div>
  )
}

export default CategoriesPage
