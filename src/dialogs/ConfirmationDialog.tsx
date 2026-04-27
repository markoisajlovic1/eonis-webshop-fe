import { IoClose } from 'react-icons/io5'

interface ConfirmationDialogProps {
  title: string
  text: string
  onConfirm: () => void
  onClose: () => void
}

const ConfirmationDialog = ({ title, text, onConfirm, onClose }: ConfirmationDialogProps) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-96 p-6 flex flex-col gap-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <IoClose size={22} />
        </button>

        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-neutral-800">{title}</h2>
          <p className="text-sm text-gray-500">{text}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-neutral-200 rounded-lg text-sm text-neutral-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Otkaži
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            Obriši
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationDialog
