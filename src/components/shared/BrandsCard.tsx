import React from 'react'
import { Link } from 'react-router-dom';
import { toSlug } from '../../utils/slug';

interface BrandsCardProps {
  name: string;
  image: string;
}

const BrandsCard: React.FC<BrandsCardProps> = ({ name, image }) => {
  return (
    <Link to={`/catalog?brand=${toSlug(name)}`} className="flex flex-col items-center gap-2 group cursor-pointer transition-transform hover:scale-105">
      <div className="w-30 h-30 md:w-42 md:h-42 rounded-full bg-white border border-neutral-100 shadow-sm flex items-center justify-center p-6 transition-all group-hover:shadow-md group-hover:border-neutral-300">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
        />
      </div>
      <span className="text-sm font-semibold text-neutral-600 group-hover:text-black">{name}</span>
    </Link>
  )
}

export default BrandsCard;