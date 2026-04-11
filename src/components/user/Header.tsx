import React, { type ChangeEvent } from 'react';
import SearchBar from './SearchBar';
import { CgProfile } from "react-icons/cg";
import { LuShoppingCart } from "react-icons/lu";


const Header: React.FC = () => {
  

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-3 bg-black backdrop-blur-md border-b border-neutral-100 font-sans">
      {/* Left side: Logo */}
      <div className="w-48">
        <div className="text-2xl font-extrabold text-white  bg-clip-text cursor-pointer">
          WebShop
        </div>
      </div>

      {/* Middle: Search Bar */}
      <SearchBar />

      {/* Right side: Auth Buttons */}
      <div className="flex items-center gap-3">
        <button className="px-5 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-neutral-800 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-black/10 transition-all flex items-center gap-2 cursor-pointer">
          <CgProfile className='text-white text-xl'/>
          <span className='text-white font-light'>
            Prijavi se
          </span>
        </button>
        <button className="px-5 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-neutral-800 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-black/10 transition-all flex items-center gap-2 cursor-pointer">
          <LuShoppingCart className='text-white text-xl'/>
          <span className='text-white font-light'>
            Korpa
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;