import ProductGallery from '../../components/user/ProductGallery';
import ProductDetails from '../../components/user/ProductDetails';
import ProductReviews from '../../components/user/ProductReviews';
import ProductComments from '../../components/user/ProductComments';
import ProductActions from '../../components/user/ProductActions';

const NAV_LINK = [
  'Početna',
  'Laptop računari',
  'Laptop, računari i IT oprema',
  'Gaming laptopovi',
  'LENOVO Legion 5 15IRX10 i7/32/1TB/5060',
];

const ProductPage = () => {

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
      <nav className="text-xs text-neutral-400 flex flex-wrap gap-0.5">
        {NAV_LINK.map((el, index) => (
          <span key={index} className={index === NAV_LINK.length - 1 ? 'text-neutral-800 font-medium' : ''}>
            {el}
            {index < NAV_LINK.length - 1 && <span className="mx-1">›</span>}
          </span>
        ))}
      </nav>

      <div className="flex gap-8 items-start">
        <div className="flex flex-col gap-6 flex-1 min-w-0">
          <ProductGallery />
          <ProductDetails />
          <ProductReviews />
          <ProductComments />
        </div>

        <div className="w-80 shrink-0">
          <ProductActions />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
