import { useState, useEffect } from "react";
import { availableStages } from "../constants/availableStages";
import { defaultInitialStages } from "../constants/defaultInitialStages";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import useAuth from "../hooks/useAuth";
import { addStage, softDeleteStage } from "../data/stages";
import {
  addApplication,
  getApplicationsByUser,
  updateApplication,
  deleteApplication,
} from "../data/applications";
import {
  PlusCircle,
  Trash2,
  SquarePen,
  Briefcase,
  Check,
  MinusCircle,
  FileText,
  Phone,
  Users,
  Video,
  Calendar,
  CheckSquare,
  MessageSquare,
  Mail,
  Send,
  Clock,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { toast } from "sonner";
import JobApplicationForm from "./JobApplicationForm";
import { Stage } from "@/types/stages";
import { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  PlusCircle,
  Briefcase,
  Trash2,
  SquarePen,
  Check,
  MinusCircle,
  FileText,
  Phone,
  Users,
  Video,
  Calendar,
  CheckSquare,
  MessageSquare,
  Mail,
  Send,
  Clock,
  X,
};
const resolveIcon = (iconName: string | LucideIcon): LucideIcon => {
  if (typeof iconName !== "string") {
    return iconName || FileText;
  }

  if (!iconName) {
    return FileText;
  }

  return iconMap[iconName] || FileText;
};

const getIconName = (icon: string | LucideIcon | undefined): string => {
  if (typeof icon === "string") {
    // If it's already a string (icon name), return it directly
    return icon;
  }

  // For icon components, we need to extract the displayName or name property
  if (icon) {
    // Try to get the component name
    const componentName = icon.displayName || icon.name;
    if (componentName) {
      return componentName;
    }
  }

  return "FileText"; // Default fallback
};

export default function JobSearchTracker() {
  const { user, signOut } = useAuth();
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [stageSelectorApp, setStageSelectorApp] = useState<string | null>(null);
  const [showAppForm, setShowAppForm] = useState(false);
  const [applications, setApplications] = useState([
    {
      id: "1",
      company: "TechCorp",
      position: "Frontend Developer",
      currentStage: 1,
      notes: "Sent resume and cover letter",
      url: "https://techcorp.com/jobs/frontend-developer",
      date: Date.now(),
      stages: [...defaultInitialStages],
    },
  ]);
  const [newApp, setNewApp] = useState({
    company: "Company Name",
    position: "Position Title",
    notes: "",
    url: "url for the job posting",
    date: Date.now(),
  });

  useEffect(() => {
    const fetchApplications = async () => {
      console.log("Fetching applications...");
      try {
        console.log("User:", user);
        if (!user) {
          throw new Error("User is not authenticated.");
        }
        const apps = await getApplicationsByUser(user.id);
        console.log("Fetched applications:", apps);
        setApplications(apps);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setApplications([]); // Set to empty array on error
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewApp({ ...newApp, [name]: value });
  };

  const handleDeleteApplication = async (appId: string) => {
    if (!user) return;

    try {
      console.log("Deleting application with ID:", appId);
      const result = await deleteApplication(appId);
      console.log("Delete result:", result);
      if (result && result.success) {
        // Remove the application from state if successfully deleted
        setApplications(applications.filter((app) => app.id !== appId));
        toast("Application deleted successfully!", {
          description: "The application has been removed from your list.",
        });
      }
    } catch (err) {
      console.error("Failed to delete application:", err);
      toast.error("Failed to delete application. Please try again.");
    }
  };

  const handleAddApplication = async () => {
    if (!user) return;
    console.log("Adding new application:", newApp);
    try {
      const newAppData = await addApplication({
        ...newApp,
        id: "",
        user_id: user.id,
        currentStage: 0,
        stages: [...defaultInitialStages], // Ensure stages is initialized
        is_deleted: false,
      });
      if (newAppData) {
        setApplications([
          ...applications,
          {
            ...newAppData,
            date: new Date(newAppData.date).getTime(),
            stages: newAppData.stages || [], // Ensure stages is initialized
          },
        ]);
        setNewApp({
          company: "",
          position: "",
          notes: "",
          url: "",
          date: Date.now(),
        });
        toast("Application added successfully!", {
          description: `"${newApp.company}" has been added to your applications.`,
        });
        setShowAppForm(false);
      }
    } catch (err) {
      console.error("Failed to add application:", err);
    }
  };

  const handleUpdateApplication = async (appId: string) => {
    if (!user) return;

    try {
      const appToUpdate = applications.find((app) => app.id === appId);
      if (!appToUpdate) return;

      await updateApplication({
        ...appToUpdate,
        user_id: user.id,
        currentStage: appToUpdate.currentStage,
        stages: appToUpdate.stages,
        is_deleted: false,
      });

      // Exit editing mode
      setEditingAppId(null);
    } catch (err) {
      console.error("Failed to update application:", err);
    }
  };

  // Set stage as completed or uncompleted
  const toggleStageCompletion = async (appId: string, stageIndex: number) => {
    if (!user) return;

    // Find the current application
    const currentApp = applications.find((app) => app.id === appId);
    if (!currentApp) return;

    // Calculate new currentStage value
    let newCurrentStage = currentApp.currentStage;
    if (stageIndex <= currentApp.currentStage) {
      // If clicking on already completed stage, uncomplete it and all after it
      newCurrentStage = stageIndex - 1;
    } else {
      // If clicking on future stage, complete it and all before it
      newCurrentStage = stageIndex;
    }

    // Create updated application object
    const updatedApp = { ...currentApp, currentStage: newCurrentStage };

    // Update local state for immediate UI feedback
    setApplications(
      applications.map((app) => (app.id === appId ? updatedApp : app))
    );

    try {
      // Persist changes to the database
      await updateApplication({
        ...updatedApp,
        user_id: user.id,
        is_deleted: false,
      });

      // Optional: Show success toast
      toast.success("Progress updated!", {
        description: "Your application progress has been saved.",
      });
    } catch (error) {
      console.error("Failed to update application progress:", error);

      // Show error message
      toast.error("Failed to save progress. Please try again.");

      // Revert local state if API call fails
      setApplications(
        applications.map((app) => (app.id === appId ? currentApp : app))
      );
    }
  };

  // Toggle stage selector
  const toggleStageSelector = (appId: string) => {
    setStageSelectorApp(stageSelectorApp === appId ? null : appId);
  };

  // Add new stage to an application's workflow
  const addStageToApplication = async (
    appId: string,
    stageData: Stage
  ): Promise<void> => {
    if (!user) return;
    try {
      // Calculate position based on current stages
      const app = applications.find((app) => app.id === appId);
      if (!app) return;

      const positions = app.stages
        .map((stage) => stage.position)
        .filter((pos): pos is number => pos !== null && pos !== undefined);

      const maxPosition = positions.length > 0 ? Math.max(...positions) : -1;
      const position = maxPosition + 1;

      // FIXED: Get a consistent icon name to store in the database
      const iconName = getIconName(stageData.icon);

      // Prepare the stage data for the backend
      const stageToAdd = {
        name: stageData.name,
        icon: iconName, // Store just the string name
        position,
        application_id: appId,
        is_deleted: false,
      };

      // Call the backend function to add the stage
      const newStage = await addStage(stageToAdd, appId);

      // Update the local state
      setApplications(
        applications.map((app) => {
          if (app.id === appId) {
            return {
              ...app,
              stages: [...app.stages, newStage],
            };
          }
          return app;
        })
      );

      toast("Stage added successfully!", {
        description: `"${stageData.name}" has been added to your application process.`,
      });

      setStageSelectorApp(null);
    } catch (err) {
      console.error("Failed to add stage:", err);
      toast.error("Failed to add stage. Please try again.");
    }
  };

  const deleteStage = async (appId: string, stageIndex: number) => {
    if (!user) return;
    console.log("Deleting stage at index:", stageIndex);
    console.log("Application ID:", appId);
    try {
      // Find the application
      const app = applications.find((a) => a.id === appId);
      if (!app || app.stages.length <= 1) return; // Don't allow deleting if there's only one stage left

      // Get the stage to delete
      const stageToDelete = app.stages[stageIndex];
      console.log("Stage to delete:", stageToDelete);
      if (!stageToDelete || !stageToDelete.id) {
        console.error("Invalid stage or missing id");
        return;
      }

      // Call the backend to soft delete the stage
      await softDeleteStage(stageToDelete.id);

      // Update the local state by removing the stage
      setApplications(
        applications.map((app) => {
          if (app.id === appId) {
            const newStages = app.stages.filter(
              (_, index) => index !== stageIndex
            );

            // Adjust currentStage if needed
            let newCurrentStage = app.currentStage;
            if (stageIndex <= app.currentStage) {
              newCurrentStage = Math.max(0, app.currentStage - 1);
            }

            return {
              ...app,
              stages: newStages,
              currentStage: newCurrentStage,
            };
          }
          return app;
        })
      );

      // Show success message
      toast("Stage removed successfully!", {
        description:
          "The stage has been removed from your application process.",
      });
    } catch (err) {
      console.error("Failed to delete stage:", err);
      toast.error("Failed to delete stage. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between p-4">
        <Label>Hello, {user?.email}</Label>
        <Button onClick={signOut} value="outline">
          Sign out
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-6">UseLess</h1>
      <p className="text-lg font-semibold mb-4">
        {" "}
        The tool you should use less
      </p>

      {/* Add new application button */}
      <Button onClick={() => setShowAppForm(!showAppForm)} variant="outline">
        <PlusCircle size={16} />
        {showAppForm ? "Cancel" : "Add New Application"}
      </Button>

      {/* New application form */}
      {showAppForm && (
        <JobApplicationForm
          newApp={newApp}
          onChange={handleInputChange}
          onSubmit={handleAddApplication}
        />
      )}

      {/* Applications list */}
      <div className="space-y-6">
        <h2 className="text-lg font-medium mb-2">Your Applications</h2>

        {applications.map((app) => (
          <div key={app.id} className="">
            <Card>
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
                <div className="flex items-center gap-2 ml-auto">
                  {/* Edit button */}
                  <button
                    onClick={() =>
                      setEditingAppId(app.id === editingAppId ? null : app.id)
                    }
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <SquarePen size={16} />
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteApplication(app.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {editingAppId === app.id ? (
                <div className="mb-6 p-4 border rounded-md bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-sm font-medium mb-1">
                        Company
                      </Label>
                      <Input
                        type="text"
                        value={app.company}
                        onChange={(e) => {
                          const updatedApp = {
                            ...app,
                            company: e.target.value,
                          };
                          setApplications(
                            applications.map((a) =>
                              a.id === app.id ? updatedApp : a
                            )
                          );
                        }}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium mb-1">
                        Position
                      </Label>
                      <Input
                        type="text"
                        value={app.position}
                        onChange={(e) => {
                          const updatedApp = {
                            ...app,
                            position: e.target.value,
                          };
                          setApplications(
                            applications.map((a) =>
                              a.id === app.id ? updatedApp : a
                            )
                          );
                        }}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label className="block text-sm font-medium mb-1">
                      Notes
                    </Label>
                    <Textarea
                      value={app.notes}
                      onChange={(e) => {
                        const updatedApp = { ...app, notes: e.target.value };
                        setApplications(
                          applications.map((a) =>
                            a.id === app.id ? updatedApp : a
                          )
                        );
                      }}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={() => handleUpdateApplication(app.id)}
                      variant="secondary"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                // Default display when not editing
                <div className="mt-2 text-sm text-gray-600"></div>
              )}
              {/* Application-specific progress stages visualization */}
              <div className="flex flex-wrap items-center p-2 gap-2 mb-10 mt-4">
                {app.stages &&
                  app.stages.map((stage, index) => {
                    // Here's the important part: Resolve string icon names to actual components
                    const IconComponent =
                      typeof stage.icon === "string"
                        ? resolveIcon(stage.icon)
                        : stage.icon || FileText;

                    const isActive = index <= app.currentStage;

                    return (
                      <div key={index} className="flex items-center">
                        <div className="relative group">
                          <button
                            onClick={() => toggleStageCompletion(app.id, index)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors 
                            ${
                              isActive
                                ? "bg-blue-500"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                          >
                            {IconComponent && (
                              <IconComponent
                                size={24}
                                className={
                                  isActive ? "text-white" : "text-gray-500"
                                }
                              />
                            )}

                            {/* Checkmark overlay that appears on hover for incomplete stages */}
                            {!isActive && (
                              <div className="absolute inset-0 bg-blue-500 bg-opacity-75 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Check size={24} className="text-white" />
                              </div>
                            )}
                          </button>
                          <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-center w-24">
                            {stage.name}
                          </span>

                          {/* Delete node button - visible on hover */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteStage(app.id, index);
                            }}
                            className="opacity-0 group-hover:opacity-100 absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 transition-opacity"
                            title="Delete this stage"
                          >
                            <MinusCircle size={16} />
                          </button>
                        </div>
                        {index < app.stages.length - 1 && (
                          <div
                            className={`h-0.5 w-8 ${
                              index < app.currentStage
                                ? "bg-blue-500"
                                : "bg-gray-200"
                            } mx-1`}
                          ></div>
                        )}
                      </div>
                    );
                  })}

                {/* Add stage button for this specific application */}
                <div className="flex items-center">
                  <div className="h-0.5 w-8 bg-gray-200 mx-1"></div>
                  <div className="relative">
                    <button
                      onClick={() => toggleStageSelector(app.id)}
                      className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    >
                      <PlusCircle size={24} className="text-gray-600" />
                    </button>
                    <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-center w-24">
                      Add Stage
                    </span>

                    {/* Stage selector dropdown specific to this application */}
                    {stageSelectorApp === app.id && (
                      <div className="absolute top-full mt-8 right-0 w-56 bg-white border rounded-md shadow-lg z-10">
                        <div className="py-1">
                          <div className="px-4 py-2 text-sm font-medium border-b">
                            Select a stage to add:
                          </div>
                          {/* Always show all available stages */}
                          {availableStages.map((stage, index) => {
                            const StageIcon = stage.icon;
                            return (
                              <button
                                key={index}
                                className="px-4 py-2 text-sm hover:bg-gray-100 flex items-center w-full"
                                onClick={() =>
                                  addStageToApplication(app.id, stage)
                                }
                              >
                                <StageIcon size={16} className="mr-2" />
                                {stage.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes section */}
              <CardFooter>
                {app.notes && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>
                      <strong>Notes:</strong> {app.notes}
                    </p>
                  </div>
                )}
              </CardFooter>
            </Card>
          </div>
        ))}

        {applications.length === 0 && (
          <div className="text-center p-8 text-gray-500">
            No applications yet. Click "Add New Application" to get started.
          </div>
        )}
      </div>
    </div>
  );
}
