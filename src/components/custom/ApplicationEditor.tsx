import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Application } from "@/types/application";
import { updateApplication } from "../../data/applications";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface ApplicationEditorProps {
  app: Application;
  editingAppId: string | null;
  setEditingAppId: (id: string | null) => void;
  onApplicationUpdate: (updatedApp: Application) => void;
}

export default function ApplicationEditor({
  app,
  editingAppId,
  setEditingAppId,
  onApplicationUpdate,
}: ApplicationEditorProps) {
  const { user } = useAuth();

  // Use local state for form values only
  const [formValues, setFormValues] = useState({
    company: app.company,
    position: app.position,
    url: app.url,
    notes: app.notes,
  });

  // Reset form values when the app prop changes
  useEffect(() => {
    setFormValues({
      company: app.company,
      position: app.position,
      url: app.url,
      notes: app.notes,
    });
  }, [app]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateApplication = async () => {
    if (!user) return;

    try {
      // Create updated application object with the form values
      const updatedApp = {
        ...app,
        company: formValues.company,
        position: formValues.position,
        url: formValues.url,
        notes: formValues.notes,
      };

      // Update the application in the database
      await updateApplication(updatedApp);

      // Update parent component state
      onApplicationUpdate(updatedApp);

      // Exit editing mode
      setEditingAppId(null);

      // Show success message
      toast.success("Application updated successfully!");
    } catch (err) {
      console.error("Failed to update application:", err);
      toast.error("Failed to update application. Please try again.");
    }
  };

  return (
    <>
      {editingAppId === app.id ? (
        <div className="mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="block text-sm font-medium mb-1">Company</Label>
              <Input
                type="text"
                name="company"
                value={formValues.company}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
              <Label className="block text-sm font-medium mb-1 mt-2">URL</Label>
              <Input
                type="url"
                name="url"
                value={formValues.url}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium mb-1">Position</Label>
              <Input
                type="text"
                name="position"
                value={formValues.position}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <div className="mt-4">
            <Label className="block text-sm font-medium mb-1">Notes</Label>
            <Textarea
              name="notes"
              value={formValues.notes}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleUpdateApplication}
              variant="default"
              className="cursor-pointer"
            >
              Save Changes
            </Button>
            <Button
              onClick={() => setEditingAppId(null)}
              variant="secondary"
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-2 text-sm text-gray-600"></div>
      )}
    </>
  );
}
