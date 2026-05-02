import React, { useState, useEffect } from 'react';
import { commentService } from '../../services/commentService';
import type { ProductCommentDTO } from '../../types/comment';
import { FaStar } from 'react-icons/fa';


interface ProductCommentsProps {
  productId: string;
}

const ProductComments: React.FC<ProductCommentsProps> = ({ productId }) => {
  const [comments, setComments] = useState<ProductCommentDTO[]>([]);

  useEffect(() => {
    commentService.getByProductId(productId).then(setComments).catch(console.error);
  }, [productId]);

  if (!comments.length) return (
    <div className="rounded-2xl border-neutral-100 flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <h2 className="text-base font-bold text-neutral-900">Komentari</h2>
        <span className='mx-auto text-center text-gray-500 italic'>Nema komentara za ovaj proizvod</span>
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl border-neutral-100 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-neutral-900">Komentari</h2>
        <span className="text-xs text-neutral-400">{comments.length} komentara</span>
      </div>

      <div className="flex flex-col">
        {comments.map((comment) => (
          <div key={comment.commentId} className="flex flex-col gap-3 my-2 bg-neutral-200 p-6 rounded-sm">
            <div className='flex justify-between'>
              <div className='flex items-center gap-1'>
                <span>{comment.totalGrade}</span>
                <FaStar />
              </div>
              <div>
                <span className="text-xs text-neutral-400">
                  {comment.firstName},{" "}
                  {new Date(comment.date).toLocaleDateString('sr-RS', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-start gap-2">
                <span>Pozitivan utisak</span>
                <p className="text-sm text-neutral-700 leading-6">{comment.positiveText}</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <span>Pozitivan utisak</span>
                <p className="text-sm text-neutral-700 leading-6">{comment.negativeText}</p>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductComments;
