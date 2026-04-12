import React from 'react'

interface ProductVerticalCardProps {
  name: string;
  price: string;
  oldPrice?: string;
  image: string;
}

const ProductVerticalCard: React.FC<ProductVerticalCardProps> = ({ name, price, oldPrice, image }) => {
  return (
    <div className="bg-white rounded-xl shadow-xs border border-neutral-100 p-4 flex flex-col gap-4 group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-50 flex items-center justify-center p-4">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
        {oldPrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
            AKCIJA
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-neutral-800 line-clamp-2 min-h-[40px] group-hover:text-black transition-colors">
          {name}
        </h3>
        
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-black">{price} RSD</span>
          {oldPrice && (
            <span className="text-xs text-neutral-400 line-through">{oldPrice} RSD</span>
          )}
        </div>
      </div>
      
      <button className="mt-auto w-full py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold opacity-0 translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0 active:bg-black">
        Dodaj u korpu
      </button>
    </div>
  )
}

export default ProductVerticalCard;