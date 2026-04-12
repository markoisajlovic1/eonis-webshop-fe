import React from 'react'

interface CategoryCardProps {
  name: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name }) => {
  return (
    <button className="px-6 py-3 bg-white border border-neutral-200 rounded-lg shadow-sm hover:shadow-md hover:border-black transition-all font-medium text-neutral-800 cursor-pointer text-center">
      {name}
    </button>
  )
}

export default CategoryCard;