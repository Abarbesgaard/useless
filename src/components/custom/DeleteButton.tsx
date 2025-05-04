import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onClick: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-red-500 hover:text-red-700 p-3"
    title="Delete"
  >
    <Trash2 size={16} />
  </button>
);
