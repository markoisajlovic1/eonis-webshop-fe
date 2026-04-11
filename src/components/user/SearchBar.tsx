import React, { type ChangeEvent } from 'react'
import { FiSearch } from "react-icons/fi";

const SearchBar = () => {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    console.log('Search input:', value);
  };
  return (
    <div className="flex-1 max-w-lg m-l-8 hidden md:block">
        <div className="relative group bg-white rounded-full flex items-center">
            
            <input
            type="text"
            className="w-full pl-4 py-2 rounded-full text-sm outline-none transition-all border border-transparent"
            placeholder="Pretraži proizvode..."
            onChange={handleSearchChange}
            />
            <button className='bg-yellow-500 rounded-full p-2.5   transition-colors hover:bg-yellow-400 cursor-pointer'>
                <FiSearch className='text-black'/>
            </button>
        </div>
    </div>
  )
}

export default SearchBar