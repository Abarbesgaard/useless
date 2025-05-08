import React from "react";
import { SquarePen } from "lucide-react";

interface EditButtonProps {
  onClick: () => void;
  isEditing?: boolean;
}

// Convert to forwardRef to properly handle refs
export const EditButton = React.forwardRef<HTMLButtonElement, EditButtonProps>(
  ({ onClick, isEditing }, ref) => (
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
