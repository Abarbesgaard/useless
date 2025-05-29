import ApplicationEditor from "../components/ApplicationEditor";
import ApplicationHeader from "../components/ApplicationHeader";
import { StageSelector } from "../components/StageSelector";
import StageToggle from "../components/StageToggle";
import { Card, CardFooter } from "../../../../components/ui/card";
import { SidebarTrigger } from "../../../../components/ui/sidebar";
import { Skeleton } from "../../../../components/ui/skeleton";
import { availableStages } from "../constants/availableStages";
import { getArchivedApplicationsByUser } from "../data/applications";
import { useApplicationManagement } from "../hooks/useApplicationManagement";
import useAuth from "../hooks/useAuth";
import { useStageManagement } from "../hooks/useStageManagement";
import { Application } from "../types/application";
import { useState, useEffect } from "react";

function ArchivedPage() {
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [archivedApplications, setArchivedApplications] = useState<
    Application[]
  >([]);
  const { user } = useAuth();

  const {
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
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleApplicationUpdate = (updatedApp: Application) => {
    updateApplication(updatedApp);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <SidebarTrigger />
      <div className="w-full h-full overflow-y-auto">
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
                <Card className="bg-muted/30 border-muted-foreground/20 opacity-75 hover:opacity-90 transition-opacity">
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
                      <div className="h-0.5 w-8 bg-muted-foreground/30 mx-1"></div>
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
                      <div className="mt-2 text-sm text-muted-foreground">
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
              <div className="text-center p-8 text-muted-foreground">
                No archived applications found.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ArchivedPage;
