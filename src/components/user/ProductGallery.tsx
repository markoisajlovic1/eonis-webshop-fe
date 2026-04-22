import React, { useState } from 'react';

const MOCK_IMAGES = [
  'https://placehold.co/600x500/f5f5f5/333?text=Laptop+Front',
  'https://placehold.co/600x500/f5f5f5/333?text=Laptop+Side',
  'https://placehold.co/600x500/f5f5f5/333?text=Laptop+Back',
  'https://placehold.co/600x500/f5f5f5/333?text=Laptop+Keyboard',
  'https://placehold.co/600x500/f5f5f5/333?text=Laptop+Port',
];

const ProductGallery: React.FC = () => {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-neutral-50 rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center border border-neutral-100">
        <img
          src={MOCK_IMAGES[selected]}
          alt="Proizvod"
          className="h-full object-contain p-6 transition-all duration-300"
        />
      </div>

      <div className="flex gap-3">
        {MOCK_IMAGES.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all bg-neutral-50 ${
              selected === i ? 'border-black' : 'border-neutral-100 hover:border-neutral-300'
            }`}
          >
            <img src={img} alt={`Slika ${i + 1}`} className="w-full h-full object-contain p-2" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
