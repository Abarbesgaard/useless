import { Archive, Heart, Link, User } from "lucide-react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
import { Application, ApplicationWithDetails } from "../types/application";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";
import { Company } from "../types/company";
import { useNavigate } from "react-router";
import { Button } from "../../../../components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../../../components/ui/popover";
interface ApplicationHeaderProps {
  app: ApplicationWithDetails;
  company?: Company;
  editingAppId: string | null;
  setEditingAppId: (id: string | null) => void;
  handleDeleteApplication: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleArchived: (app: Application) => void;
}

export default function ApplicationHeader({
  app,
  company,
  editingAppId,
  toggleFavorite,
  handleDeleteApplication,
  toggleArchived,
}: ApplicationHeaderProps) {
  const navigate = useNavigate();
  const handleHeaderClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on action buttons
    if ((e.target as HTMLElement).closest(".action-buttons")) {
      return;
    }
    navigate(`/app/details/${app.id}`);
  };
  return (
    <div>
      <div className="relative flex justify-between items-center mb-4 p-4  rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="text-left flex-grow">
          <CardHeader className="mb-2">
            <CardTitle className="text-xl font-semibold">
              <span
                className="cursor-pointer hover:text-chart-1 transition-colors inline-block"
                onClick={handleHeaderClick}
              >
                {company?.name || app.company}
              </span>
            </CardTitle>
            <CardDescription className="text-sm">
              {app.position}
            </CardDescription>
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
            <Popover>
              <PopoverTrigger asChild>
                <button className="p-0 border-none">
                  <User
                    className={`w-4 h-4 ${
                      app.contact_name
                        ? "text-chart-2"
                        : "text-sidebar-ring hover:opacity-75"
                    } transition-colors cursor-pointer`}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent className="z-1">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Contact Information
                  </h3>
                  {app.contact_name ? (
                    <div>
                      <p>
                        <strong>Name:</strong> {app.contact_name}
                      </p>
                      {app.contact_phone && (
                        <p>
                          <strong>Phone:</strong> {app.contact_phone}
                        </p>
                      )}
                      {app.contact_email && (
                        <p>
                          <strong>Email:</strong>{" "}
                          <a
                            href={`mailto:${app.contact_email}`}
                            className="text-chart-1 underline hover:text-sidebar-primary"
                          >
                            {app.contact_email}
                          </a>
                        </p>
                      )}
                    </div>
                  ) : (
                    <p>No contact information available.</p>
                  )}
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        navigate(`/app/edit-application/${app.id}`)
                      }
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </CardContent>
        </div>
        {/* Action buttons positioned at the top-right corner */}
        <div className="absolute top-2 right-2 flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => toggleFavorite(app.id)}>
                  <Heart
                    className={`w-6 h-6 cursor-pointer ${
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
                    className={`w-6 h-6 cursor-pointer ${
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
                  onClick={() => navigate(`/app/edit-application/${app.id}`)}
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
    </div>
  );
}
