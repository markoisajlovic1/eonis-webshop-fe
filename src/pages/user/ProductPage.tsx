import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductGallery from '../../components/user/ProductGallery';
import ProductDetails from '../../components/user/ProductDetails';
import ProductReviews from '../../components/user/ProductReviews';
import ProductComments from '../../components/user/ProductComments';
import ProductActions from '../../components/user/ProductActions';
import { productService } from '../../services/productService';
import type { ProductDTO } from '../../types/product';

const ProductPage = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productSlug) return;
    productService.getById(productSlug)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productSlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40 text-sm text-gray-400">
        Učitavanje...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center py-40 text-sm text-gray-400">
        Proizvod nije pronađen.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
      <nav className="text-xs text-neutral-400 flex flex-wrap gap-0.5">
        {['Početna', product.subcategory.categoryName, product.subcategory.subcategoryName, product.productName].map((crumb, i, arr) => (
          <span key={i} className={i === arr.length - 1 ? 'text-neutral-800 font-medium' : ''}>
            {crumb}
            {i < arr.length - 1 && <span className="mx-1">›</span>}
          </span>
        ))}
      </nav>

      <div className="flex gap-8 items-start">
        <div className="flex flex-col gap-10 flex-1 min-w-0 mb-40">
          <ProductGallery images={product.images.slice().sort((a, b) => a.position - b.position).map(img => img.imageLink)} />
          <ProductDetails product={product} />
          <ProductReviews productId={product.productId} />
          <ProductComments productId={product.productId} />
        </div>

        <div className="w-100 h-full flex items-center relative shrink-0">
          <ProductActions
            productId={product.productId}
            name={product.productName}
            price={product.price}
            discount={product.discount}
            quantity={product.quantity}
            image={product.images[0]?.imageLink ?? ''}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
