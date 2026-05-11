import { useState, useEffect } from 'react';
import BannerSlider from '../../components/user/BannerSlider'
import promoImage from '../../assets/banners/image (8).webp';
import ProductVerticalCard from '../../components/shared/ProductVerticalCard';
import CategoryCard from '../../components/shared/CategoryCard';
import BrandsCard from '../../components/shared/BrandsCard';
import { useCategories } from '../../hooks/useCategories';
import { useBrands } from '../../hooks/useBrands';
import { productService } from '../../services/productService';
import type { ProductDTO } from '../../types/product';
import { FaBoxes } from "react-icons/fa";
import CheckOrderStatusDialog from '../../dialogs/CheckOrderStatusDialog';


const HomePage = () => {
  const { data: categories = [] } = useCategories()
  const { data: brands = [] } = useBrands()
  const [recommended, setRecommended] = useState<ProductDTO[]>([])
  const [checkOrderOpen, setCheckOrderOpen] = useState(false)

  useEffect(() => {
    productService.getRecommended().then(setRecommended).catch(console.error)
  }, [])

  const openCheckOrderStatusDialog = () => setCheckOrderOpen(true)

  return (
    <>
    <div className="bg-neutral-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
            {/**check order */}
            <div className='bg-yellow-100 py-4 px-8 shadow-sm mt-6 rounded-md flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <FaBoxes />
                    <span className='font-semibold'>Proverite status porudzbine</span>
                </div>

                <button onClick={openCheckOrderStatusDialog} className='bg-white px-4 py-1 shadow-sm rounded-md'>Proveri status</button>
            </div>
            {/* Hero Section */}
            <div className='flex flex-col md:flex-row gap-4 pt-10'>
                <div className="flex-1 min-w-0">
                    <BannerSlider />
                </div>
                <div className="md:w-1/3 lg:w-1/4 h-[200px] md:h-[400px] bg-yellow-400 rounded-xl relative overflow-hidden">
                    <div className='absolute rounded-full bg-black md:h-[400px] w-full z-0 bottom-70'></div>
                    <img
                        src={promoImage}
                        alt="Promo"
                        className="w-full h-full object-contain rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer z-10"
                    />
                    <div className='absolute rounded-full bg-black md:h-[400px] w-full z-0 top-80'></div>
                </div>
            </div>

            {/* Categories Section */}
            <section className="px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Kategorije</h2>
                    <button className="text-sm font-semibold text-neutral-500 hover:text-black transition-colors">Vidi sve</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {categories.slice(0, 10).map(cat => (
                        <CategoryCard key={cat.categoryId} id={cat.categoryId} name={cat.name} />
                    ))}
                </div>
            </section>

            {/* Recommended Products Section */}
            <section className="px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Preporučeni proizvodi</h2>
                    <button className="text-sm font-semibold text-neutral-500 hover:text-black transition-colors">Svi proizvodi</button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {recommended.map(product => (
                        <ProductVerticalCard
                            key={product.productId}
                            name={product.productName}
                            price={product.price}
                            oldPrice={product.discount > 0 ? product.price / (1 - product.discount / 100) : undefined}
                            image={product.images[0]?.imageLink ?? ''}
                            slug={product.productId}
                            quantity={product.quantity}
                        />
                    ))}
                </div>
            </section>

            {/* Brands Section */}
            <section className="px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Brendovi</h2>
                    <button className="text-sm font-semibold text-neutral-500 hover:text-black transition-colors">Svi brendovi</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-10 md:gap-12  pb-4 md:justify-between mb-10">
                    {brands.slice(0, 12).map(brand => (
                        <BrandsCard
                            key={brand.brandId}
                            name={brand.brandName}
                            image={brand.brandImage}
                        />
                    ))}
                </div>
            </section>
        </div>
    </div>
    {checkOrderOpen && (
      <CheckOrderStatusDialog onClose={() => setCheckOrderOpen(false)} />
    )}
    </>
  )
}

export default HomePage;