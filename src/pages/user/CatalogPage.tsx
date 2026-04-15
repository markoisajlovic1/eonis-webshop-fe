import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../../mockData/products';
import ProductVerticalCard from '../../components/shared/ProductVerticalCard';
import { FiFilter, FiChevronDown } from "react-icons/fi";

const CatalogPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  
  // States filters
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 300000 });
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name-asc' | 'price-asc' | 'price-desc'>('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // for filters
  const allBrands = useMemo(() => Array.from(new Set(products.map(p => p.brand))), []);
  const allColors = useMemo(() => Array.from(new Set(products.map(p => p.color))), []);

  // Filtering and Sorting Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const matchColor = selectedColors.length === 0 || selectedColors.includes(p.color);
      const matchPrice = p.price >= priceRange.min && p.price <= priceRange.max;
      return matchBrand && matchColor && matchPrice;
    });

    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedBrands, selectedColors, priceRange, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs & Header */}
        <div className="mb-4">
          <p className="text-xs text-neutral-500 mb-2 uppercase tracking-widest">Početna / {categorySlug}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-end gap-2">
              <h1 className="text-3xl font-semibold text-black capitalize">{categorySlug?.replace('-', ' ')}</h1>
              <p className="text-xs text-neutral-500 uppercase tracking-widest">{filteredProducts.length} proizvoda</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl gap-4">
              {/* <span className="text-sm text-neutral-500">Prikazano <span className="font-bold text-black">{currentProducts.length}</span> od <span className="font-bold text-black">{filteredProducts.length}</span> proizvoda</span> */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500 whitespace-nowrap">Sortiraj po:</span>
                <select 
                  className="bg-gray-200 border border-neutral-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-black cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="name-asc">Nazivu (A-Z)</option>
                  <option value="price-asc">Ceni (Rastuće)</option>
                  <option value="price-desc">Ceni (Opadajuće)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-400 mb-8" />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-1/4 flex flex-col gap-6">
            {/* Brand Filter */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
              <h3 className="font-bold mb-4 flex items-center justify-between">
                Brendovi <FiChevronDown />
              </h3>
              <div className="flex flex-col gap-3">
                {allBrands.map(brand => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-black rounded"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                    />
                    <span className="text-sm text-neutral-600 group-hover:text-black transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
              <h3 className="font-bold mb-4">Cena (RSD)</h3>
              <div className="flex flex-col gap-4">
                <input 
                  type="range" 
                  min="0" 
                  max="300000" 
                  step="1000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                  className="w-full accent-black"
                />
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <span className="text-[10px] text-neutral-400 block ml-1 uppercase">Od</span>
                    <input 
                      type="number" 
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                      className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-neutral-400 block ml-1 uppercase">Do</span>
                    <input 
                      type="number" 
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 0 }))}
                      className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Color Filter */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
              <h3 className="font-bold mb-4">Boja</h3>
              <div className="flex flex-wrap gap-2">
                {allColors.map(color => (
                  <button
                    key={color}
                    onClick={() => {
                        setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
                        setCurrentPage(1);
                    }}
                    className={`px-3 py-1 rounded-full text-xs border transition-all ${
                      selectedColors.includes(color) 
                        ? 'bg-black text-white border-black' 
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-black'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid & Sorting */}
          <main className="lg:w-3/4 flex flex-col gap-6">
            

            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts.map(product => (
                  <ProductVerticalCard 
                    key={product.id}
                    name={product.name}
                    price={product.price}
                    oldPrice={product.oldPrice}
                    image={product.image}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-20 rounded-3xl border border-dashed border-neutral-200 text-center flex flex-col items-center gap-4">
                <div className="text-4xl">🔎</div>
                <h3 className="text-xl font-bold">Nema rezultata</h3>
                <p className="text-neutral-500">Pokušajte da promenite filtere ili pretragu.</p>
                <button 
                  onClick={() => { setSelectedBrands([]); setSelectedColors([]); setPriceRange({ min: 0, max: 300000 }); }}
                  className="mt-2 text-black font-bold border-b-2 border-black"
                >
                  Resetuj sve filtere
                </button>
              </div>
            )}

            {/* Pagination Handler */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-neutral-200 disabled:opacity-30 hover:border-black transition-all cursor-pointer"
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${
                      currentPage === i + 1 
                        ? 'bg-black text-white' 
                        : 'bg-white border border-neutral-200 hover:border-black cursor-pointer text-neutral-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-neutral-200 disabled:opacity-30 hover:border-black transition-all cursor-pointer"
                >
                  →
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;