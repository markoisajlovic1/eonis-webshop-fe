import BannerSlider from '../../components/user/BannerSlider'
import promoImage from '../../assets/banners/image (8).webp';
import ProductVerticalCard from '../../components/shared/ProductVerticalCard';
import CategoryCard from '../../components/shared/CategoryCard';
import BrandsCard from '../../components/shared/BrandsCard';
import { categories } from '../../mockData/categories';
import { brands } from '../../mockData/brands';
import { products } from '../../mockData/products';

const HomePage = () => {
  return (
    <div className="bg-neutral-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className='flex flex-col md:flex-row gap-4 px-4 pt-6'>
                <div className="flex-1 min-w-0">
                    <BannerSlider />
                </div>
                <div className="md:w-1/3 lg:w-1/4 h-[200px] md:h-[400px]">
                    <img 
                        src={promoImage} 
                        alt="Promo" 
                        className="w-full h-full object-cover rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer" 
                    />
                </div>
            </div>

            {/* Categories Section */}
            <section className="px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Kategorije</h2>
                    <button className="text-sm font-semibold text-neutral-500 hover:text-black transition-colors">Vidi sve</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                    {categories.map(cat => (
                        <CategoryCard key={cat.id} name={cat.name} />
                    ))}
                </div>
            </section>

            {/* Recommended Products Section */}
            <section className="px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Preporučeni proizvodi</h2>
                    <button className="text-sm font-semibold text-neutral-500 hover:text-black transition-colors">Svi proizvodi</button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {products.map(product => (
                        <ProductVerticalCard 
                            key={product.id}
                            name={product.name}
                            price={product.price}
                            oldPrice={product.oldPrice}
                            image={product.image}
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
                <div className="flex items-center gap-6 md:gap-12 overflow-x-auto no-scrollbar pb-4 md:justify-between">
                    {brands.map(brand => (
                        <BrandsCard 
                            key={brand.id}
                            name={brand.name}
                            image={brand.image}
                        />
                    ))}
                </div>
            </section>
        </div>
    </div>
  )
}

export default HomePage;