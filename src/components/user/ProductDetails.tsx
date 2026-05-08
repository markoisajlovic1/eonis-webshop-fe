import React, { useState } from 'react';
import type { ProductDTO } from '../../types/product';

interface ProductDetailsProps {
  product: ProductDTO;
}

type Tab = 'opis' | 'detalji';

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<Tab>('detalji');

  const details = [
    { label: 'Naziv', value: product.productName },
    { label: 'Brend', value: product.brandName },
    { label: 'Kategorija', value: product.subcategory.categoryName },
    { label: 'Potkategorija', value: product.subcategory.subcategoryName },
  ];

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-hidden">
      <div className="flex border-b border-neutral-100">
        {(['detalji', 'opis'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-sm font-semibold capitalize transition-all ${
              activeTab === tab
                ? 'text-black border-b-2 border-black bg-neutral-50'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === 'opis' ? (
          <p className="text-sm text-neutral-600 leading-7 whitespace-pre-line">{product.desc}</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <tbody>
              {details.map(({ label, value }) => (
                <tr key={label} className="border-b border-neutral-100 last:border-0 flex gap-1">
                  <td className="py-3 px-4 pr-6 text-neutral-400 font-medium w-1/2 bg-neutral-100 mb-1">{label}</td>
                  <td className="py-3 px-4 text-neutral-800 w-1/2 bg-neutral-100 mb-1">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
