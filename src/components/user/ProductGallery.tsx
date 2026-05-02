import React, { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [selected, setSelected] = useState(0);

  if (!images.length) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-neutral-50 rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center border border-neutral-300">
        <img
          src={images[selected]}
          alt="Proizvod"
          className="h-full object-contain p-6 transition-all duration-300"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-40 aspect-square rounded-xl overflow-hidden border-2 transition-all bg-neutral-50 ${
                selected === i ? 'border-black' : 'border-neutral-100 hover:border-neutral-300'
              }`}
            >
              <img src={img} alt={`Slika ${i + 1}`} className="w-full h-full object-contain p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
