import React, { useState } from 'react';

const MOCK_DESCRIPTION = `LENOVO Legion 5 15IRX10 je gaming laptop dizajniran za visoke performanse i dugotrajnu upotrebu.
Opremljen najnovijim Intel Core i7 procesorom i NVIDIA GeForce RTX 5060 grafičkom karticom, ovaj laptop
pruža izuzetno iskustvo u igricama i zahtevnim radnim zadacima. 15.6-inčni IPS ekran sa 165Hz refresh
stopom garantuje savršenu sliku bez zamućenja. Napredni sistem hlađenja Legion Coldfront 5.0 osigurava
optimalnu temperaturu čak i tokom najzahtevnijih sesija.`;

const MOCK_SPECS = [
  { label: 'Procesor', value: 'Intel Core i7-13700HX, 2.1GHz - 5.0GHz, 24 jezgra' },
  { label: 'RAM memorija', value: '32GB DDR5 5600MHz' },
  { label: 'Grafička karta', value: 'NVIDIA GeForce RTX 5060 8GB GDDR6' },
  { label: 'Skladište', value: '1TB NVMe SSD PCIe 4.0' },
  { label: 'Ekran', value: '15.6" IPS, 2560x1440, 165Hz, 100% sRGB' },
  { label: 'Operativni sistem', value: 'Windows 11 Home' },
  { label: 'Baterija', value: '80Wh Li-Ion, do 7 sati' },
  { label: 'Dimenzije', value: '357.7 x 260.7 x 21.7 mm' },
  { label: 'Težina', value: '2.4 kg' },
  { label: 'Konektivnost', value: 'Wi-Fi 6E, Bluetooth 5.3' },
];

type Tab = 'opis' | 'specifikacije';

const ProductDetails: React.FC = () => {
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
          <p className="text-sm text-neutral-600 leading-7">{MOCK_DESCRIPTION}</p>
        ) : (
          <div className="flex flex-col divide-y divide-neutral-100">
            {MOCK_SPECS.map((spec) => (
              <div key={spec.label} className="flex py-3 gap-4">
                <span className="w-40 shrink-0 text-sm font-medium text-neutral-500">{spec.label}</span>
                <span className="text-sm text-neutral-800">{spec.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
