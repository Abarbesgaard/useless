import { useState } from "react";
import { availableStages } from "../constants/availableStages";
import { defaultInitialStages } from "../constants/defaultInitialStages";
import useAuth from "../hooks/useAuth";
import { addApplication } from "../data/applications";
import {
  PlusCircle,
  Trash2,
  SquarePen,
  Check,
  MinusCircle,
} from "lucide-react";

import { LucideIcon } from "lucide-react";

type Stage = {
  id: string;
  name: string;
  icon: LucideIcon;
};

export default function JobSearchTracker() {
  // Sample job application
  const [applications, setApplications] = useState([
    {
      id: 1,
      company: "TechCorp",
      position: "Frontend Developer",
      currentStage: 1,
      notes: "Sent resume and cover letter",
      url: "https://techcorp.com/jobs/frontend-developer",
      date: Date.now(),
      stages: [...defaultInitialStages],
    },
  ]);

  // State for new application form
  const [newApp, setNewApp] = useState({
    company: "Company Name",
    position: "Position Title",
    notes: "",
    url: "url for the job posting",
    date: Date.now(),
  });

  const [editingAppId, setEditingAppId] = useState<number | null>(null);

  const { user, signOut } = useAuth();
  // Stage selector state
  const [stageSelectorApp, setStageSelectorApp] = useState<number | null>(null);

  // Form display toggle
  const [showAppForm, setShowAppForm] = useState(false);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewApp({ ...newApp, [name]: value });
  };

  const handleAddApplication = async () => {
    if (!user) return;

    try {
      const newAppData = await addApplication(
        {
          ...newApp,
          id: Date.now(), // Temporary unique ID
          user_id: user.id,
          currentStage: 0,
          stages: [...defaultInitialStages],
        },
        user.id
      );
      if (newAppData) {
        setApplications([...applications, newAppData]);
        setNewApp({
          company: "",
          position: "",
          notes: "",
          url: "",
          date: Date.now(),
        });
        setShowAppForm(false);
      }
    } catch (err) {
      console.error("Failed to add application:", err);
    }
  };

  // Set stage as completed or uncompleted
  const toggleStageCompletion = (appId: number, stageIndex: number) => {
    setApplications(
      applications.map((app) => {
        if (app.id === appId) {
          // If clicking on already completed stage, uncomplete it and all after it
          if (stageIndex <= app.currentStage) {
            return { ...app, currentStage: stageIndex - 1 };
          }
          // If clicking on future stage, complete it and all before it
          else {
            return { ...app, currentStage: stageIndex };
          }
        }
        return app;
      })
    );
  };

  // Delete an application
  const deleteApplication = (id: number) => {
    setApplications(applications.filter((app) => app.id !== id));
    if (stageSelectorApp === id) {
      setStageSelectorApp(null);
    }
  };

  // Toggle stage selector
  const toggleStageSelector = (appId: number) => {
    setStageSelectorApp(stageSelectorApp === appId ? null : appId);
  };

  // Add new stage to an application's workflow
  const addStageToApplication = (appId: number, stageData: Stage) => {
    setApplications(
      applications.map((app) => {
        if (app.id === appId) {
          // No longer checking if stage already exists - always add it
          return {
            ...app,
            stages: [...app.stages, stageData],
          };
        }
        return app;
      })
    );
    setStageSelectorApp(null);
  };

  // Delete a stage from an application's workflow
  const deleteStage = (appId: number, stageIndex: number) => {
    setApplications(
      applications.map((app) => {
        if (app.id === appId) {
          // Don't allow deleting if there's only one stage left
          if (app.stages.length <= 1) return app;

          const newStages = [...app.stages];
          newStages.splice(stageIndex, 1);

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
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between p-4">
        <div>Hello, {user?.email}</div>
        <button
          onClick={signOut}
          className="bg-red-500 px-2 py-1 rounded text-white"
        >
          Sign out
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-6">UseLess</h1>
      <p className="text-lg font-semibold mb-4">
        {" "}
        The tool you should use less
      </p>

      {/* Add new application button */}
      <button
        onClick={() => setShowAppForm(!showAppForm)}
        className="mb-6 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        <PlusCircle size={16} />
        {showAppForm ? "Cancel" : "Add New Application"}
      </button>

      {/* New application form */}
      {showAppForm && (
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input
                type="text"
                name="company"
                value={newApp.company}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="Company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <input
                type="text"
                name="position"
                value={newApp.position}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="Job title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL</label>
              <input
                type="url"
                name="url"
                value={newApp.url}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="Job posting URL"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              value={newApp.notes}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Additional notes"
            />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>You can customize stages after adding the application.</p>
          </div>
          <button
            onClick={handleAddApplication}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Save Application
          </button>
        </div>
      )}

      {/* Applications list */}
      <div className="space-y-6">
        <h2 className="text-lg font-medium mb-2">Your Applications</h2>

        {applications.map((app) => (
          <div
            key={app.id}
            className="border rounded-md p-4 bg-white shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="text-left items-center">
                <h3 className="font-bold text-lg">{app.company}</h3>
                <p className="text-gray-600">{app.position}</p>
                <a
                  href={app.url}
                  className="text-sm text-gray-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {app.url}
                </a>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() =>
                    setEditingAppId(app.id === editingAppId ? null : app.id)
                  }
                  className="text-blue-500 hover:text-blue-700"
                  title="Edit"
                >
                  <SquarePen size={16} />
                </button>
                <button
                  onClick={() => deleteApplication(app.id)}
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
                    <label className="block text-sm font-medium mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={app.company}
                      onChange={(e) => {
                        const updatedApp = { ...app, company: e.target.value };
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
                    <label className="block text-sm font-medium mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      value={app.position}
                      onChange={(e) => {
                        const updatedApp = { ...app, position: e.target.value };
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
                  <label className="block text-sm font-medium mb-1">
                    Notes
                  </label>
                  <textarea
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
                  <button
                    onClick={() => setEditingAppId(null)} // Save and exit editing mode
                    className="bg-green-600 text-white px-4 py-2 rounded-md"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              // Default display when not editing
              <div className="mt-2 text-sm text-gray-600"></div>
            )}
            {/* Application-specific progress stages visualization */}
            <div className="flex flex-wrap items-center gap-2 mb-10 mt-4">
              {app.stages.map((stage, index) => {
                const IconComponent = stage.icon;
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
                        <IconComponent
                          size={24}
                          className={isActive ? "text-white" : "text-gray-500"}
                        />

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
            {app.notes && (
              <div className="mt-2 text-sm text-gray-600">
                <p>
                  <strong>Notes:</strong> {app.notes}
                </p>
              </div>
            )}
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
