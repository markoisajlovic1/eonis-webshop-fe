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
        <span>Početna<span className="mx-1">›</span></span>
        <span className="text-neutral-800 font-medium">{product.productName}</span>
      </nav>

      <div className="flex gap-8 items-start">
        <div className="flex flex-col gap-6 flex-1 min-w-0">
          <ProductGallery images={product.images} />
          <ProductDetails desc={product.desc} />
          <ProductReviews />
          <ProductComments />
        </div>

        <div className="w-80 shrink-0">
          <ProductActions
            name={product.productName}
            price={product.price}
            discount={product.discount}
            quantity={product.quantity}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
