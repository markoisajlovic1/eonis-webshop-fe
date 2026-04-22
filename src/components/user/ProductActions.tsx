import React, { useState } from 'react';
import { LuShoppingCart } from 'react-icons/lu';
import { FiHeart } from 'react-icons/fi';

const MOCK_PRODUCT = {
  name: 'LENOVO Legion 5 15IRX10 i7/32/1TB/5060',
  price: 189999,
  oldPrice: 209999,
  inStock: true,
  stockCount: 5,
};

const ProductActions: React.FC = () => {
  const [wishlist, setWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (p: number) => p.toLocaleString('sr-RS');

  return (
    <div className="top-20  rounded-md bg-white p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold  text-3xl text-neutral-900 leading-snug">
          {MOCK_PRODUCT.name}
        </h1>
      </div>

      <div
        className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full w-fit`}
      >
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            MOCK_PRODUCT.inStock ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        {MOCK_PRODUCT.inStock
          ? `Na stanju (${MOCK_PRODUCT.stockCount} kom)`
          : 'Nije na stanju'}
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-3xl font-semibold text-neutral-900">
          {formatPrice(MOCK_PRODUCT.price)} RSD
        </span>
        {MOCK_PRODUCT.oldPrice && (
          <span className="text-sm text-neutral-400 line-through">
            {formatPrice(MOCK_PRODUCT.oldPrice)} RSD
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-500">Količina</span>
        <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-50 transition-colors text-lg font-light"
          >
            −
          </button>
          <span className="px-4 py-1.5 text-sm font-semibold border-x border-neutral-200">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(MOCK_PRODUCT.stockCount, q + 1))}
            className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-50 transition-colors text-lg font-light"
          >
            +
          </button>
        </div>
      </div>

      <button
        disabled={!MOCK_PRODUCT.inStock}
        className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-neutral-800 active:bg-neutral-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <LuShoppingCart className="text-lg" />
        Dodaj u korpu
      </button>

      <button
        onClick={() => setWishlist((w) => !w)}
        className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold border transition-all ${
          wishlist
            ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50'
        }`}
      >
        <FiHeart className={`text-lg ${wishlist ? 'fill-red-500 text-red-500' : ''}`} />
        {wishlist ? 'Ukloni iz liste želja' : 'Dodaj u listu želja'}
      </button>
    </div>
  );
};

export default ProductActions;
