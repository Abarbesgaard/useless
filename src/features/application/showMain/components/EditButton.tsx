import { forwardRef } from "react";
import { SquarePen } from "lucide-react";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

interface EditButtonProps {
  isEditing?: boolean;
  onClick: () => void;
}

// Convert to forwardRef to properly handle refs
export const EditButton = forwardRef<HTMLButtonElement, EditButtonProps>(
  ({ isEditing, onClick }, ref) => (
    <TooltipTrigger asChild>
      <button
        className="cursor-pointer"
        ref={ref}
        onClick={onClick}
        title={isEditing ? "Cancel Edit" : "Edit"}
      >
        <SquarePen
          className={`w-6 h-6 ${
            isEditing ? "text-chart-1" : "text-sidebar-ring"
          } transition-colors`}
        />
      </button>
    </TooltipTrigger>
  )
);

EditButton.displayName = "EditButton";
