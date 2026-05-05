import React from 'react'
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { LuShoppingCart } from "react-icons/lu";
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { wishlistService } from '../../services/wishlistService';
import { cartService } from '../../services/cartService/cartService';
import { cartServiceLS } from '../../services/cartService/cartServiceLS';
import { increment } from '../../store/slices/cartSlice'
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice'
interface ProductVerticalCardProps {
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  slug: string;
}

const ProductVerticalCard: React.FC<ProductVerticalCardProps> = ({ name, price, oldPrice, image, slug }) => {
  const formatPrice = (p: number) => p.toLocaleString('sr-RS');
  const userId = useSelector((state: RootState) => state.auth.userId);
  const wishlistIds = useSelector((state: RootState) => state.wishlist.productIds);
  const isWishlisted = wishlistIds.includes(slug);
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (isWishlisted) {
      wishlistService.remove(userId, slug).catch(console.error);
      dispatch(removeFromWishlist(slug));
    } else {
      wishlistService.add({ userId, productId: slug }).catch(console.error);
      dispatch(addToWishlist(slug));
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // na osnovu toga dal je user ulogovan skontamo dal treba u bazu il LS
    if (userId) {
      cartService.create({ userId, productId: slug, quantity: 1 }).catch(console.error);
    } else {
      cartServiceLS.add({ productId: slug, productName: name, price, image });
    }

    dispatch(increment());
  };

  return (
    <Link to={`/proizvodi/${slug}`} className="relative bg-white rounded-xl shadow-xs border border-neutral-100 p-4 flex flex-col gap-4 group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
      {
        userId && (
          <button
            onClick={handleAddToWishlist}
            className="absolute top-3 right-3 z-10 w-9 h-9 bg-yellow-400 border-neutral-200 rounded-full flex items-center cursor-pointer justify-center text-white hover:bg-yellow-600 transition-all shadow-sm"
          >
            {isWishlisted ? <FaHeart size={16} /> : <FiHeart size={16} />}
          </button>
        )
      }
      <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-50 flex items-center justify-center p-4">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
        {oldPrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
            AKCIJA
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-neutral-800 line-clamp-2 min-h-[40px] group-hover:text-black transition-colors">
          {name}
        </h3>
        
        <div className="mt-2 flex flex-col items-baseline gap-2">
          <span className="text-lg font-bold text-black">{formatPrice(price)} RSD</span>
          {oldPrice && (
            <span className="text-xs text-neutral-400 line-through">{formatPrice(oldPrice)} RSD</span>
          )}
        </div>
      </div>
      
      <button onClick={handleAddToCart} className="mt-auto flex items-center gap-2 justify-center w-full py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold opacity-0 translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0 hover:bg-gray-600 active:bg-black cursor-pointer">
        <LuShoppingCart />
        <span>Dodaj u korpu</span>
      </button>
    </Link>
  )
}

export default ProductVerticalCard;