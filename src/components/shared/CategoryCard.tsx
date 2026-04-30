import { Link } from 'react-router-dom';

interface CategoryCardProps {
  id: string;
  name: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, name }) => {
  return (
    <Link
      to={`/catalog/${id}`}
      className="px-6 py-3 flex items-center justify-center bg-white border border-neutral-200 rounded-lg shadow-sm hover:shadow-md hover:border-black transition-all font-medium text-neutral-800 cursor-pointer text-center "
    >
      {name}
    </Link>
  )
}

export default CategoryCard;