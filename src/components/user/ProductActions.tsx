import React, { useState } from 'react';
import { LuShoppingCart } from 'react-icons/lu';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { cartService } from '../../services/cartService/cartService';
import { cartServiceLS } from '../../services/cartService/cartServiceLS';
import { wishlistService } from '../../services/wishlistService';
import { increment } from '../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';

interface ProductActionsProps {
  productId: string;
  name: string;
  price: number;
  discount: number;
  quantity: number;
  image: string;
}

const ProductActions: React.FC<ProductActionsProps> = ({ productId, name, price, discount, quantity, image }) => {
  const userId = useSelector((state: RootState) => state.auth.userId);
  const wishlistIds = useSelector((state: RootState) => state.wishlist.productIds);
  const isWishlisted = wishlistIds.includes(productId);
  const dispatch = useDispatch<AppDispatch>();

  const [qty, setQty] = useState(1);

  const formatPrice = (p: number) => p.toLocaleString('sr-RS');
  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price;
  const inStock = quantity > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    if (userId) {
      cartService.create({ userId, productId, quantity: qty }).catch(console.error);
    } else {
      for (let i = 0; i < qty; i++) {
        cartServiceLS.add({ productId, productName: name, price: discountedPrice, image });
      }
    }
    dispatch(increment());
  };

  const handleToggleWishlist = () => {
    if (!userId) return;
    if (isWishlisted) {
      wishlistService.remove(userId, productId).catch(console.error);
      dispatch(removeFromWishlist(productId));
    } else {
      wishlistService.add({ userId, productId }).catch(console.error);
      dispatch(addToWishlist(productId));
    }
  };

  return (
    <div className="top-30 rounded-md fixed bg-white p-6 flex flex-col gap-5 mx-auto w-100 shadow-md">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-3xl text-neutral-900 leading-snug">{name}</h1>
      </div>

      <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full w-fit">
        <span className={`w-2.5 h-2.5 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
        {inStock ? `Na stanju (${quantity} kom)` : 'Nije na stanju'}
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-3xl font-semibold text-neutral-900">
          {formatPrice(discountedPrice)} RSD
        </span>
        {discount > 0 && (
          <span className="text-sm text-neutral-400 line-through">{formatPrice(price)} RSD</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-500">Količina</span>
        <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setQty(q => Math.max(1, q - 1))}
            className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-50 transition-colors text-lg font-light cursor-pointer"
          >
            −
          </button>
          <span className="px-4 py-1.5 text-sm font-semibold border-x border-neutral-200">{qty}</span>
          <button
            onClick={() => setQty(q => Math.min(quantity, q + 1))}
            className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-50 transition-colors text-lg font-light cursor-pointer"
          >
            +
          </button>
        </div>
      </div>

      <div className='mt-10 flex flex-col gap-4'>
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-neutral-800 hover:text-white active:bg-neutral-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <LuShoppingCart className="text-lg" />
          {inStock ? 'Dodaj u korpu' : 'Nema na zalihama'}
        </button>

        {userId && (
          <button
            onClick={handleToggleWishlist}
            className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
              isWishlisted
                ? 'bg-yellow-50 border-yellow-200 text-red-600 hover:bg-red-100'
                : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50'
            }`}
          >
            {isWishlisted
              ? <FaHeart className="text-lg text-yellow-500" />
              : <FiHeart className="text-lg" />
            }
            {isWishlisted ? 'Ukloni iz liste želja' : 'Dodaj u listu želja'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductActions;
