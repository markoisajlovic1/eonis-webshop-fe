import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { IoTrashBinOutline, IoChevronBack } from "react-icons/io5"
import { LiaExchangeAltSolid } from "react-icons/lia"
import { brandService } from "../../services/brandService"
import { categoryService } from "../../services/categoryService"
import type { BrandDTO } from "../../types/brand"
import type { CategoryDTO, SubcategoryDTO } from "../../types/categories"
import SelectDialog from "../../dialogs/SelectDialog"
import type { SelectDialogItem } from "../../dialogs/SelectDialog"
import ProductImageDialog from "../../dialogs/ProductImageDialog"
import { IoIosRemoveCircle } from "react-icons/io"
import { productService } from "../../services/productService"

const MAX_IMAGES = 5
type DialogType = 'brand' | 'category' | 'subcategory' | null

const AdminProductPage = () => {
  const navigate = useNavigate()
  const [openDialog, setOpenDialog] = useState<DialogType>(null)
  const [publishing, setPublishing] = useState(false)

  const [images, setImages] = useState<(string | null)[]>(Array(MAX_IMAGES).fill(null))
  const [imageDialogIndex, setImageDialogIndex] = useState<number | null>(null)

  const [productName, setProductName] = useState('')
  const [price, setPrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [discountEnabled, setDiscountEnabled] = useState(false)
  const [desc, setDesc] = useState('')

  // svi izvuceni
  const [brands, setBrands] = useState<BrandDTO[]>([])
  const [categories, setCategories] = useState<CategoryDTO[]>([])
  const [subcategories, setSubcategories] = useState<SubcategoryDTO[]>([])

  // selektovani u poljuma
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null)

  useEffect(() => {
    brandService.getAll().then(setBrands).catch(console.error)
    categoryService.getAllCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    if (!selectedCategoryId) {
      setSubcategories([])
      setSelectedSubcategoryId(null)
      return
    }
    categoryService.getSubcategoriesByCategoryId(selectedCategoryId)
      .then(setSubcategories)
      .catch(console.error)
  }, [selectedCategoryId])

  const selectedBrand = brands.find((b) => b.brandId === selectedBrandId) ?? null
  const selectedCategory = categories.find((c) => c.categoryId === selectedCategoryId) ?? null
  const selectedSubcategory = subcategories.find((s) => s.subcategoryId === selectedSubcategoryId) ?? null

  const brandItems: SelectDialogItem[] = brands.map((b) => ({
    id: b.brandId,
    label: b.brandName,
    image: b.brandImage,
  }))

  const categoryItems: SelectDialogItem[] = categories.map((c) => ({
    id: c.categoryId,
    label: c.name,
  }))

  const subcategoryItems: SelectDialogItem[] = subcategories.map((s) => ({
    id: s.subcategoryId,
    label: s.name,
  }))

  const handleCategorySelect = (id: string) => {
    setSelectedCategoryId(id)
    setSelectedSubcategoryId(null)
  }

  const handlePublish = async () => {
    if (!productName.trim() || !price || !selectedBrandId || !selectedSubcategoryId) return
    setPublishing(true)
    try {
      await productService.create({
        productName: productName.trim(),
        price: parseFloat(price),
        discount: discountEnabled ? parseInt(discount) || 0 : 0,
        brandId: selectedBrandId,
        desc: desc.trim(),
        subcategoryId: selectedSubcategoryId,
        productImageUrls: images.filter((img): img is string => img !== null),
      })
      navigate(-1)
    } catch (error) {
      console.error(error)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="p-4 flex flex-col gap-6">
      {/* Actions */}
      <div className="bg-white flex justify-between items-center p-4 rounded-md">
        <div className="flex items-center gap-6">
          <button className="hover:bg-neutral-200 duration-100 p-1 rounded-full cursor-pointer" onClick={() => navigate(-1)}>
            <IoChevronBack />
          </button>
          <div>
            <h2 className="text-xl">Novi proizvod</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="border-red-500 bg-red-200 p-2 text-red-500 rounded-md cursor-pointer mr-4">
            <IoTrashBinOutline />
          </button>
          <button className="border py-1 px-3 rounded-md border-gray-400 cursor-pointer">Draft</button>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="bg-blue-500 disabled:opacity-50 text-white rounded-md py-1 px-3 cursor-pointer"
          >
            {publishing ? 'Čuvanje...' : 'Postavi'}
          </button>
        </div>
      </div>

      {/* Product details */}
      <div className="flex gap-6 items-start">

        {/* LEVI DEO ----- */}
        <div className="flex flex-col gap-4 w-1/2 shrink-0">
          <div className="rounded-md overflow-hidden flex gap-3">
            {/* Glavna slika na index 0 */}
            <div
              onClick={() => !images[0] && setImageDialogIndex(0)}
              className={`relative w-1/2 bg-white rounded-md flex items-center justify-center text-sm text-gray-400 overflow-hidden ${!images[0] ? 'cursor-pointer hover:bg-neutral-100 transition-colors p-4' : ''}`}
              style={{ minHeight: '11rem' }}
            >
              {images[0] ? (
                <>
                  <img src={images[0]} alt="glavna" className="absolute inset-0 w-full h-full  object-contain object-center" />
                  <button
                    onClick={(e) => { e.stopPropagation(); setImages((prev) => { const next = [...prev]; next[0] = null; return next }) }}
                    className="absolute top-1.5 right-1.5 text-white drop-shadow cursor-pointer z-10"
                  >
                    <IoIosRemoveCircle size={22} className="text-red-500" />
                  </button>
                </>
              ) : (
                'Glavna slika'
              )}
            </div>
            {/* Ostale slike na indeksu 1-4 */}
            <div className="grid grid-cols-2 grid-rows-2 gap-3 flex-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  onClick={() => !images[i] && setImageDialogIndex(i)}
                  className={`relative bg-white rounded-md flex items-center justify-center text-xs text-gray-300 h-20 overflow-hidden ${!images[i] ? 'cursor-pointer hover:bg-neutral-100 transition-colors' : ''}`}
                >
                  {images[i] ? (
                    <>
                      <img src={images[i]!} alt={`slika-${i}`} className="absolute inset-0 w-full h-full object-contain object-center" />
                      <button
                        onClick={(e) => { e.stopPropagation(); setImages((prev) => { const next = [...prev]; next[i] = null; return next }) }}
                        className="absolute top-1 right-1 cursor-pointer z-10"
                      >
                        <IoIosRemoveCircle size={18} className="text-red-500 drop-shadow" />
                      </button>
                    </>
                  ) : (
                    '+'
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div
            onClick={() => setOpenDialog('brand')}
            className="bg-white flex items-center p-4 gap-6 cursor-pointer hover:bg-neutral-200 transition-all rounded-md"
          >
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center overflow-hidden shrink-0">
              {selectedBrand?.brandImage ? (
                <img src={selectedBrand.brandImage} alt={selectedBrand.brandName} className="w-full h-full object-contain p-1" />
              ) : (
                <span className="text-xs text-gray-300">Logo</span>
              )}
            </div>
            <div className="flex justify-between items-center gap-1 w-full min-w-0">
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Brend</span>
                <span className={`text-sm truncate ${selectedBrand ? 'text-neutral-800' : 'text-neutral-400'}`}>
                  {selectedBrand ? selectedBrand.brandName : '—'}
                </span>
              </div>
              <LiaExchangeAltSolid className="shrink-0 text-gray-400" />
            </div>
          </div>

          {/* Category & Subcategory */}
          <div className="bg-white rounded-md flex flex-col">
            <div
              onClick={() => setOpenDialog('category')}
              className="flex flex-col gap-1 cursor-pointer hover:bg-neutral-200 transition-all p-4 rounded-t-md"
            >
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Kategorija</span>
              <span className={`text-sm ${selectedCategory ? 'text-neutral-800' : 'text-neutral-400'}`}>
                {selectedCategory ? selectedCategory.name : '—'}
              </span>
            </div>
            <div className="h-px bg-neutral-100 mx-4" />
            <div
              onClick={() => selectedCategoryId && setOpenDialog('subcategory')}
              className={`flex flex-col gap-1 p-4 rounded-b-md transition-all ${
                selectedCategoryId
                  ? 'cursor-pointer hover:bg-neutral-200'
                  : 'cursor-not-allowed opacity-50'
              }`}
            >
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Subkategorija</span>
              <span className={`text-sm ${selectedSubcategory ? 'text-neutral-800' : 'text-neutral-400'}`}>
                {selectedSubcategory ? selectedSubcategory.name : selectedCategoryId ? '—' : 'Izaberite kategoriju'}
              </span>
            </div>
          </div>
        </div>

        {/* DESNI DEO ------------ */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white rounded-md p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Naziv proizvoda</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Unesite naziv proizvoda"
                className="border border-neutral-200 rounded-md px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:border-neutral-400 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cena (RSD)</label>
              <input
                min={0}
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className="border border-neutral-200 rounded-md px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:border-neutral-400 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Popust (%)</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-gray-400">Aktiviraj popust</span>
                  <input
                    type="checkbox"
                    checked={discountEnabled}
                    onChange={(e) => setDiscountEnabled(e.target.checked)}
                    className="w-4 h-4 accent-blue-500 cursor-pointer"
                  />
                </label>
              </div>
              <input
                type="number"
                min={0}
                max={100}
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="0"
                disabled={!discountEnabled}
                className={`border rounded-md px-3 py-2 text-sm focus:outline-none transition-colors ${
                  discountEnabled
                    ? "border-neutral-200 text-neutral-800 focus:border-neutral-400"
                    : "border-neutral-100 text-neutral-300 bg-neutral-50 cursor-not-allowed"
                }`}
              />
            </div>
          </div>

          <div className="bg-white rounded-md p-6 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Opis proizvoda</label>
            <textarea
              rows={7}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Unesite opis proizvoda..."
              className="border border-neutral-200 rounded-md px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:border-neutral-400 transition-colors resize-none"
            />
          </div>
        </div>

      </div>


      {/**DIALOZI */}
      {openDialog === 'brand' && (
        <SelectDialog
          title="Izaberite brend"
          items={brandItems}
          selectedId={selectedBrandId}
          onSelect={setSelectedBrandId}
          onClose={() => setOpenDialog(null)}
        />
      )}

      {openDialog === 'category' && (
        <SelectDialog
          title="Izaberite kategoriju"
          items={categoryItems}
          selectedId={selectedCategoryId}
          onSelect={handleCategorySelect}
          onClose={() => setOpenDialog(null)}
        />
      )}

      {openDialog === 'subcategory' && (
        <SelectDialog
          title="Izaberite subkategoriju"
          items={subcategoryItems}
          selectedId={selectedSubcategoryId}
          onSelect={setSelectedSubcategoryId}
          onClose={() => setOpenDialog(null)}
        />
      )}

      {imageDialogIndex !== null && (
        <ProductImageDialog
          onSave={(url) => setImages((prev) => {
            const next = [...prev]
            next[imageDialogIndex] = url
            return next
          })}
          onClose={() => setImageDialogIndex(null)}
        />
      )}
    </div>
  )
}

export default AdminProductPage
