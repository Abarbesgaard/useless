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
    <div className="flex justify-between items-center mb-4">
      <div className="text-left items-center">
        <CardHeader>
          <CardTitle>{app.company}</CardTitle>
          <CardDescription>{app.position}</CardDescription>
        </CardHeader>
        <CardContent>
          <a
            href={app.url}
            className="text-sm text-gray-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {app.url}
          </a>
        </CardContent>
      </div>
      <div className="flex items-center gap-2 ml-auto p-2">
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
