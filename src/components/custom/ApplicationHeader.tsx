import { Archive, Heart, Link } from "lucide-react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
import { Application } from "@/types/application";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
interface ApplicationHeaderProps {
  app: Application;
  editingAppId: string | null;
  setEditingAppId: (id: string | null) => void;
  handleDeleteApplication: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleArchived: (app: Application) => void;
}

export default function ApplicationHeader({
  app,
  editingAppId,
  setEditingAppId,
  toggleFavorite,
  handleDeleteApplication,
  toggleArchived,
}: ApplicationHeaderProps) {
  return (
    <div className="relative flex justify-between items-center mb-4 p-4  rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="text-left flex-grow">
        <CardHeader className="mb-2">
          <CardTitle className="text-xl font-semibold ">
            {app.company}
          </CardTitle>
          <CardDescription className="text-sm">{app.position}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <a
            href={app.url}
            className="text-sm text-chart-1 underline hover:text-sidebar-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Link className="w-4 h-4" />
          </a>
        </CardContent>
      </div>
      {/* Action buttons positioned at the top-right corner */}
      <div className="absolute top-2 right-2 flex space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={() => toggleFavorite(app.id)}>
                <Heart
                  className={`w-6 h-6 ${
                    app.favorite
                      ? "text-chart-5 fill-chart-5"
                      : "text-sidebar-ring"
                  } transition-colors`}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {app.favorite ? "Remove from favorites" : "Add to favorites"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={() => toggleArchived(app)} className="p-2">
                <Archive
                  className={`w-6 h-6 ${
                    app.is_archived ? "text-chart-3" : "text-sidebar-ring"
                  } transition-colors`}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {app.is_archived
                  ? "Unarchive application"
                  : "Archive application"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <EditButton
                isEditing={app.id === editingAppId}
                onClick={() =>
                  setEditingAppId(app.id === editingAppId ? null : app.id)
                }
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {app.id === editingAppId
                  ? "Cancel editing"
                  : "Edit application"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DeleteButton onClick={() => handleDeleteApplication(app.id)} />
      </div>
    </div>
  );
}
