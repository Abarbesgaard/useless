import ApplicationEditor from "../components/ApplicationEditor";
import ApplicationHeader from "../components/ApplicationHeader";
import JobApplicationForm from "../components/JobApplicationForm";
import { StageSelector } from "../components/StageSelector";
import StageToggle from "../components/StageToggle";
import { useApplicationManagement } from "../hooks/useApplicationManagement";
import { useStageManagement } from "../hooks/useStageManagement";
import { Application } from "../types/application";
import { availableStages } from "../constants/availableStages";
{
  /* Shadcn */
}
import { Card, CardFooter } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

function FavoritesPage() {
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [favoriteApplications, setFavoriteApplications] = useState<
    Application[]
  >([]);

  const {
    applications,
    newApp,
    showAppForm,
    handleInputChange,
    addApplication,
    deleteApplication,
    updateApplication,
    toggleFavorite,
    toggleStageCompletion,
    fetchFavoriteApplications,
    toggleArchived,
    isLoading,
  } = useApplicationManagement();

  const {
    stageSelectorApp,
    toggleStageSelector,
    addStageToApplication,
    deleteStage,
  } = useStageManagement(favoriteApplications, setFavoriteApplications);

  useEffect(() => {
    const favApps = applications.filter((app) => app && app.favorite === true);
    setFavoriteApplications(favApps);
  }, [applications]);

  useEffect(() => {
    fetchFavoriteApplications();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplicationUpdate = (updatedApp: Application) => {
    updateApplication(updatedApp);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <SidebarTrigger />
      {/* Main Content */}
      <div className="w-full h-full overflow-y-auto">
        {/* Application Form */}
        {showAppForm && (
          <div className="mt-4">
            <JobApplicationForm
              newApp={newApp}
              onChange={handleInputChange}
              onSubmit={addApplication}
              companyInfo={{
                id: "",
                user_id: "",
                name: "",
                phone: "",
                email: "",
                website: "",
                notes: undefined,
              }}
              contactPerson={{
                id: "",
                user_id: "",
                name: "",
                position: "",
                email: "",
                phone: "",
                notes: "",
              }}
            />
          </div>
        )}

        {/* Applications list - Only showing favorites */}
        <div className="space-y-2 pt-3 pb-16">
          <h2 className="text-lg font-medium mb-2 flex">
            Your Favorite Applications
          </h2>

          {favoriteApplications.map((app) => (
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
              {favoriteApplications.map((app) => (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FavoritesPage;
