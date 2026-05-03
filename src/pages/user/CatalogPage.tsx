import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductVerticalCard from '../../components/shared/ProductVerticalCard';
import { FiChevronLeft, FiChevronRight, FiChevronDown } from "react-icons/fi";
import { useAllSubcategories } from '../../hooks/useAllSubcategories';
import { productService } from '../../services/productService';
import { toSlug } from '../../utils/slug';
import type { ProductDTO, ProductSort } from '../../types/product';

const PAGE_SIZE = 12

const SORT_OPTIONS: { label: string; value: ProductSort }[] = [
  { label: 'Nazivu (A-Z)', value: 'NameAsc' },
  { label: 'Nazivu (Z-A)', value: 'NameDesc' },
  { label: 'Ceni (Rastuće)', value: 'PriceAsc' },
  { label: 'Ceni (Opadajuće)', value: 'PriceDesc' },
]

const CatalogPage: React.FC = () => {
  const { subcategorySlug } = useParams<{ subcategorySlug: string }>();
  const { data: allSubcategories = [] } = useAllSubcategories();

  const subcategory = allSubcategories.find(s => toSlug(s.name) === subcategorySlug);

  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<ProductSort>('NameAsc');
  const [page, setPage] = useState(1);


  useEffect(() => {
    if (!subcategory) return;
    setLoading(true);
    productService.filter({
      subcategoryId: subcategory.subcategoryId,
      sort,
      isPublished: true,
      pageNumber: page,
      pageSize: PAGE_SIZE,
    })
      .then(result => {
        setProducts(result.items);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [subcategory, sort, page]);

  return (
    <div className="bg-neutral-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-4">
          <p className="text-xs text-neutral-500 mb-2 uppercase tracking-widest">
            Početna / {subcategory?.name ?? subcategorySlug}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-end gap-2">
              <h1 className="text-3xl font-semibold text-black capitalize">
                {subcategory?.name ?? subcategorySlug}
              </h1>
              <p className="text-xs text-neutral-500 uppercase tracking-widest">{totalCount} proizvoda</p>
            </div>

            <div className="flex items-center gap-2 p-4">
              <span className="text-sm text-neutral-500 whitespace-nowrap">Sortiraj po:</span>
              <select
                className="bg-gray-200 border border-neutral-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-black cursor-pointer"
                value={sort}
                onChange={e => setSort(e.target.value as ProductSort)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
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
                {['Brend 1', 'Brend 2', 'Brend 3'].map(brand => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 accent-black rounded" />
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
                  defaultValue={300000}
                  className="w-full accent-black"
                />
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <span className="text-[10px] text-neutral-400 block ml-1 uppercase">Od</span>
                    <input
                      type="number"
                      defaultValue={0}
                      className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm outline-none focus:border-black"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-neutral-400 block ml-1 uppercase">Do</span>
                    <input
                      type="number"
                      defaultValue={300000}
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
                {['Crna', 'Bela', 'Siva', 'Plava'].map(color => (
                  <button
                    key={color}
                    className="px-3 py-1 rounded-full text-xs border bg-white text-neutral-600 border-neutral-200 hover:border-black transition-all"
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="lg:w-3/4 flex flex-col gap-6">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-sm text-gray-400">
                Učitavanje...
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white p-20 rounded-3xl border border-dashed border-neutral-200 text-center flex flex-col items-center gap-4">
                <div className="text-4xl">🔎</div>
                <h3 className="text-xl font-bold">Nema rezultata</h3>
                <p className="text-neutral-500">Pokušajte da promenite filtere ili pretragu.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductVerticalCard
                    key={product.productId}
                    name={product.productName}
                    price={product.price}
                    oldPrice={product.discount > 0 ? product.price / (1 - product.discount / 100) : undefined}
                    image={product.images[0]?.imageLink ?? ''}
                    slug={product.productId}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <FiChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer
                      ${p === page ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-200'}`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <FiChevronRight size={16} />
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
