import { SquarePen } from "lucide-react";

interface EditButtonProps {
  onClick: () => void;
  isEditing?: boolean;
}

export const EditButton: React.FC<EditButtonProps> = ({
  onClick,
  isEditing,
}) => (
  <button
    onClick={onClick}
    className="text-blue-500 hover:text-blue-700"
    title={isEditing ? "Cancel Edit" : "Edit"}
  >
    <SquarePen size={16} />
  </button>
);
