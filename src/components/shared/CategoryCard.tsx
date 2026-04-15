import { Link } from 'react-router-dom';

interface CategoryCardProps {
  name: string;
  slug: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, slug }) => {
  return (
    <Link 
      to={`/${slug}`}
      className="px-6 py-3 bg-white border border-neutral-200 rounded-lg shadow-sm hover:shadow-md hover:border-black transition-all font-medium text-neutral-800 cursor-pointer text-center block"
    >
      {name}
    </Link>
  )
}

export default CategoryCard;