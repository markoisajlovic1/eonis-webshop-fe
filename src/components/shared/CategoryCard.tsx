import { Link } from 'react-router-dom';
import { toSlug } from '../../utils/slug';

interface CategoryCardProps {
  id: string;
  name: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name }) => {
  return (
    <Link
      to={`/catalog?category=${toSlug(name)}`}
      className="px-6 py-3 flex items-center justify-center bg-white border border-neutral-200 rounded-lg shadow-sm hover:shadow-md hover:border-black transition-all font-medium text-neutral-800 cursor-pointer text-center "
    >
      {name}
    </Link>
  )
}

export default CategoryCard;