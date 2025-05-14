import ApplicationEditor from "@/components/custom/ApplicationEditor";
import ApplicationHeader from "@/components/custom/ApplicationHeader";
import JobApplicationForm from "@/components/custom/JobApplicationForm";
import { StageSelector } from "@/components/custom/StageSelector";
import StageToggle from "@/components/custom/StageToggle";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { availableStages } from "@/constants/availableStages";
import { getArchivedApplicationsByUser } from "@/data/applications";
import { useApplicationManagement } from "@/hooks/useApplicationManagement";
import useAuth from "@/hooks/useAuth";
import { useStageManagement } from "@/hooks/useStageManagement";
import { Application } from "@/types/application";
import { PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";

function ArchivedPage() {
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [archivedApplications, setArchivedApplications] = useState<
    Application[]
  >([]);
  const { user } = useAuth();

  const {
    newApp,
    showAppForm,
    setShowAppForm,
    handleInputChange,
    addApplication,
    deleteApplication,
    updateApplication,
    toggleFavorite,
    toggleStageCompletion,
    toggleArchived,
    isLoading,
  } = useApplicationManagement();

  const {
    stageSelectorApp,
    toggleStageSelector,
    addStageToApplication,
    deleteStage,
  } = useStageManagement(archivedApplications, setArchivedApplications);

  const fetchAndSetArchivedApplications = async () => {
    if (!user) {
      setArchivedApplications([]); // Clear if no user
      return;
    }
    try {
      const apps = await getArchivedApplicationsByUser(user.id);
      setArchivedApplications(apps);
    } catch (error) {
      console.error("Failed to fetch archived applications:", error);
      setArchivedApplications([]); // Set to empty array on error
    }
  };

  // Fetch archived applications on mount or when user changes
  useEffect(() => {
    fetchAndSetArchivedApplications();
  }, [user]);

  const handleApplicationUpdate = (updatedApp: Application) => {
    updateApplication(updatedApp);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <SidebarTrigger />
      {/* Main Content */}
      <div className="w-full h-full overflow-y-auto">
        {/* Add New Application Button */}
        <div>
          <Button
            onClick={() => setShowAppForm(!showAppForm)}
            className="flex items-center gap-2"
          >
            <PlusCircle size={16} />
            {showAppForm ? "Cancel" : "Add New Application"}
          </Button>
        </div>

        {/* Application Form */}
        {showAppForm && (
          <div className="mt-4">
            <JobApplicationForm
              newApp={newApp}
              onChange={handleInputChange}
              onSubmit={addApplication}
            />
          </div>
        )}

        {/* Applications list - Only showing archived */}
        <div className="space-y-2 pt-3 pb-16">
          <h2 className="text-lg font-medium mb-2 flex">
            Your Archived Applications
          </h2>

          {archivedApplications.map((app) => (
            <div key={app.id} className="w-4xl p-3 overflow-y-auto"></div>
          ))}

          {isLoading ? (
            // Render 3 skeleton placeholders while loading
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="w-4xl p-3">
                <Card className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-[40%]" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-3 w-[60%]" />
                  <div className="flex space-x-2 pt-4">
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>
                </Card>
              </div>
            ))
          ) : (
            <>
              {archivedApplications.map((app) => (
                <div key={app.id} className="w-4xl p-3 overflow-y-auto">
                  <Card>
                    <ApplicationHeader
                      app={app}
                      editingAppId={editingAppId}
                      setEditingAppId={setEditingAppId}
                      toggleFavorite={toggleFavorite}
                      handleDeleteApplication={deleteApplication}
                      toggleArchived={toggleArchived}
                    />
                    <ApplicationEditor
                      app={app}
                      editingAppId={editingAppId}
                      setEditingAppId={setEditingAppId}
                      onApplicationUpdate={handleApplicationUpdate}
                    />
                    <div className="flex flex-wrap items-center pl-6">
                      <StageToggle
                        app={app}
                        toggleStageCompletion={toggleStageCompletion}
                        deleteStage={deleteStage}
                      />
                      <div className="flex items-center">
                        <div className="h-0.5 w-8 bg-gray-200 mx-1"></div>
                        <div className="relative">
                          <StageSelector
                            appId={app.id}
                            stageSelectorApp={stageSelectorApp}
                            toggleStageSelector={toggleStageSelector}
                            addStageToApplication={addStageToApplication}
                            availableStages={availableStages}
                          />
                        </div>
                      </div>
                    </div>
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
              {archivedApplications.length === 0 && (
                <div className="text-center p-8 text-gray-500">
                  No applications yet. Click "Add New Application" to get
                  started.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArchivedPage;
