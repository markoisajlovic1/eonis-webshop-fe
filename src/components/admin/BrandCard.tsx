interface BrandCardProps {
  name: string
  logo: string
  onEdit: () => void
  onDelete: () => void
}

const BrandCard = ({ name, logo, onEdit, onDelete }: BrandCardProps) => {
  return (
    <div className='flex flex-col bg-white w-fit p-4 rounded-md shadow-md gap-4'>
      <img className='h-20 w-20 rounded-full border border-gray-200 p-2 mx-auto' src={logo} alt={name} />
      <h3 className='text-center font-semibold'>{name}</h3>
      <div className='flex gap-3 mt-4'>
        <button onClick={onEdit} className='bg-gray-700 text-white px-3 rounded-md cursor-pointer'>Izmeni</button>
        <button onClick={onDelete} className='text-red-500 hover:text-red-700 cursor-pointer'>Ukloni</button>
      </div>
    </div>
  )
}

export default BrandCard
