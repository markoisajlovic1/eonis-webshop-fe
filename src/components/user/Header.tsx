import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SearchBar from './SearchBar';
import { CgProfile } from "react-icons/cg";
import { LuShoppingCart } from "react-icons/lu";
import { AiOutlineMenu } from "react-icons/ai";
import { FiHeart } from "react-icons/fi";
import { useCategories } from '../../hooks/useCategories';
import { productService } from '../../services/productService';
import type { ProductDTO } from '../../types/product';
import type { RootState } from '../../store/store';

const Header: React.FC = () => {
  const { username } = useSelector((state: RootState) => state.auth);
  const { data: categories = [] } = useCategories();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchedProducts, setSearchedProducts] = useState<ProductDTO[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (term: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!term.trim()) { setSearchedProducts([]); return }
    debounceRef.current = setTimeout(() => {
      productService.search(term.trim())
        .then(setSearchedProducts)
        .catch(console.error)
    }, 400)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-9999 flex items-center justify-between px-8 py-3 bg-black backdrop-blur-md border-b border-neutral-100 font-sans">
      {/* Left side: Logo */}
      <div className="w-48 flex items-center gap-2 relative">
        <Link to="/" className="text-2xl font-extrabold text-white bg-clip-text cursor-pointer">
          WebShop
        </Link>

        {/* Dropdown lista */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="px-5 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-neutral-800 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-black/10 transition-all flex items-center gap-2 cursor-pointer outline-none"
          >
            <AiOutlineMenu className='text-white text-xl'/>
            <span className='text-white font-light'>
              Proizvodi
            </span>
          </button>

          {isMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-neutral-100 overflow-hidden z-50 transition-all duration-300 transform opacity-100 scale-100">
              <div className="py-2 flex flex-col">
                {categories.map((cat) => (
                  <Link
                    key={cat.categoryId}
                    to={`/catalog/${cat.categoryId}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-black hover:pl-6 transition-all border-l-4 border-transparent hover:border-yellow-500 font-medium"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

        

      {/* Middle: Search Bar */}
      <SearchBar searchedProducts={searchedProducts} onSearch={handleSearch} />

      {/* Right side: Auth Buttons */}
      <div className="flex items-center gap-3">
        {username ? (
          <div className='flex items-center gap-3'>
            <Link
              to="/profile"
              className="px-5 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-neutral-800 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-black/10 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CgProfile className='text-white text-xl'/>
              <span className='text-white font-light'>{username}</span>
            </Link>

            <button className="px-5 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-neutral-800 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-black/10 transition-all flex items-center gap-2 cursor-pointer">
              <FiHeart className='text-white text-xl'/>
              <span className='text-white font-light'>Lista želja</span>
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="px-5 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-neutral-800 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-black/10 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CgProfile className='text-white text-xl'/>
            <span className='text-white font-light'>Prijavi se</span>
          </Link>
        )}
        <Link to={"/cart"} className="px-5 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-neutral-800 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-black/10 transition-all flex items-center gap-2 cursor-pointer">
          <LuShoppingCart className='text-white text-xl'/>
          <span className='text-white font-light'>Korpa</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;