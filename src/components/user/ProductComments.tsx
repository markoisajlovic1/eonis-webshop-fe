import React from 'react';
import { FaStar } from 'react-icons/fa';

interface Comment {
  id: number;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  text: string;
  helpful: number;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: 1,
    author: 'Marko Petrović',
    avatar: 'MP',
    date: '15. mart 2025.',
    rating: 5,
    text: 'Odličan laptop, jako brz i tih za gaming. Baterija traje duže nego što sam očekivao. Preporučujem svima koji traže dobar gaming laptop.',
    helpful: 24,
  },
  {
    id: 2,
    author: 'Jelena Nikolić',
    avatar: 'JN',
    date: '2. april 2025.',
    rating: 4,
    text: 'Veoma dobar laptop za cenu. Jedina zamerka je što se malo zagreje tokom dužeg gaminga, ali to je normalno za ovakve konfiguracije. Generalno zadovoljna.',
    helpful: 11,
  },
  {
    id: 3,
    author: 'Stefan Jovanović',
    avatar: 'SJ',
    date: '10. april 2025.',
    rating: 5,
    text: 'Koristim ga za rad i gaming — savršen za oboje. Ekran je fenomenalan, boje su živopisne. Dostava je bila brza i pakovanje odlično.',
    helpful: 18,
  },
  {
    id: 4,
    author: 'Ana Đorđević',
    avatar: 'AD',
    date: '18. april 2025.',
    rating: 3,
    text: 'Laptop je solidan ali nisam oduševljena. Zvučnici su slabiji nego što sam očekivala. Za taj novac moglo je biti bolje, ali radi posao.',
    helpful: 6,
  },
];

const Stars: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <FaStar key={s} className={s <= value ? 'text-gray-800' : 'text-neutral-200'} />
    ))}
  </div>
);

const ProductComments: React.FC = () => {

  return (
    <div className="rounded-2xl  border-neutral-100 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-neutral-900">Komentari</h2>
        <span className="text-xs text-neutral-400">{MOCK_COMMENTS.length} komentara</span>
      </div>

      <div className="flex flex-col">
        {MOCK_COMMENTS.map((comment) => (
          <div key={comment.id} className="flex flex-col gap-3 my-2 bg-neutral-200 p-6 rounded-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {comment.avatar}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-neutral-800">{comment.author}</span>
                <span className="text-xs text-neutral-400">{comment.date}</span>
              </div>
              <div className="ml-auto">
                <Stars value={comment.rating} />
              </div>
            </div>

            <p className="text-sm text-neutral-600 leading-6">{comment.text}</p>

            
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductComments;
