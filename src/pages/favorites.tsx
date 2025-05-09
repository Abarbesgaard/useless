import ApplicationEditor from "@/components/custom/ApplicationEditor";
import ApplicationHeader from "@/components/custom/ApplicationHeader";
import JobApplicationForm from "@/components/custom/JobApplicationForm";
import { StageSelector } from "@/components/custom/StageSelector";
import StageToggle from "@/components/custom/StageToggle";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { availableStages } from "@/constants/availableStages";
import { useApplicationManagement } from "@/hooks/useApplicationManagement";
import { useStageManagement } from "@/hooks/useStageManagement";
import { Application } from "@/types/application";
import { PlusCircle } from "lucide-react";
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
    setShowAppForm,
    handleInputChange,
    addApplication,
    deleteApplication,
    updateApplication,
    toggleFavorite,
    toggleStageCompletion,
    fetchFavoriteApplications,
    toggleArchived,
  } = useApplicationManagement();

  const {
    stageSelectorApp,
    toggleStageSelector,
    addStageToApplication,
    deleteStage,
  } = useStageManagement(favoriteApplications, setFavoriteApplications);

  useEffect(() => {
    const favApps = applications.filter((app) => app.favorite === true);
    setFavoriteApplications(favApps);
  }, [applications]);

  useEffect(() => {
    fetchFavoriteApplications();
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

        {/* Applications list - Only showing favorites */}
        <div className="space-y-2 pt-3 pb-16">
          <h2 className="text-lg font-medium mb-2 flex">
            Your Favorite Applications
          </h2>

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

          {favoriteApplications.length === 0 && (
            <div className="text-center p-8 text-gray-500">
              No favorite applications yet. Mark applications as favorites to
              see them here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FavoritesPage;
