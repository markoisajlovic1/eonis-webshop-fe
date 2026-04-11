import BannerSlider from '../../components/user/BannerSlider'
import promoImage from '../../assets/banners/image (8).webp';

const HomePage = () => {
  return (
    <div className="bg-neutral-50 min-h-screen max-w-6xl mx-auto">
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
        
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Kategorije</h1>
            <h1 className="text-3xl font-bold mb-8">Preporučeni proizvodi</h1>
            <h1 className="text-3xl font-bold mb-8">Brendovi</h1>
        </div>
    </div>
  )
}

export default HomePage