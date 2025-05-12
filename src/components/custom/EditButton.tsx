import { forwardRef } from "react";
import { SquarePen } from "lucide-react";

interface EditButtonProps {
  isEditing?: boolean;
  onClick: () => void;
}

// Convert to forwardRef to properly handle refs
export const EditButton = forwardRef<HTMLButtonElement, EditButtonProps>(
  ({ isEditing, onClick }, ref) => (
    <button
      ref={ref}
      onClick={onClick}
      title={isEditing ? "Cancel Edit" : "Edit"}
    >
      <SquarePen
        className={`w-6 h-6 ${
          isEditing ? "text-blue-600" : "text-gray-400"
        } transition-colors`}
      />
    </button>
  )
);

EditButton.displayName = "EditButton";
