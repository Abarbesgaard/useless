import { Link } from "lucide-react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
interface ApplicationHeaderProps {
  app: {
    id: string;
    company: string;
    position: string;
    url: string;
  };
  editingAppId: string | null;
  setEditingAppId: (id: string | null) => void;
  handleDeleteApplication: (id: string) => void;
}

export default function ApplicationHeader({
  app,
  editingAppId,
  setEditingAppId,
  handleDeleteApplication,
}: ApplicationHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="text-left flex-grow">
        <CardHeader className="mb-2">
          <CardTitle className="text-xl font-semibold text-gray-800">
            {app.company}
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            {app.position}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <a
            href={app.url}
            className="text-sm text-blue-600 underline hover:text-blue-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Link className="w-4 h-4" />
          </a>
        </CardContent>
      </div>
      <div className="flex-col items-center gap-2 ml-auto p-2">
        <EditButton
          onClick={() =>
            setEditingAppId(app.id === editingAppId ? null : app.id)
          }
          isEditing={app.id === editingAppId}
        />
        <DeleteButton onClick={() => handleDeleteApplication(app.id)} />
      </div>
    </div>
  );
}
