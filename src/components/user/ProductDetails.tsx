import React, { useState } from 'react';

interface ProductDetailsProps {
  desc: string;
}

type Tab = 'opis' | 'specifikacije';

const ProductDetails: React.FC<ProductDetailsProps> = ({ desc }) => {
  const [activeTab, setActiveTab] = useState<Tab>('opis');

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-hidden">
      <div className="flex border-b border-neutral-100">
        {(['opis', 'specifikacije'] as Tab[]).map((tab) => (
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
          <p className="text-sm text-neutral-600 leading-7 whitespace-pre-line">{desc}</p>
        ) : (
          <p className="text-sm text-neutral-400">Specifikacije nisu dostupne.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
