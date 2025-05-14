import { useState } from "react";
import { availableStages } from "../constants/availableStages";
import { Button } from "../components/ui/button";
import { PlusCircle } from "lucide-react";
import { Card, CardFooter } from "../components/ui/card";
import JobApplicationForm from "../components/custom/JobApplicationForm";
import ApplicationHeader from "@/components/custom/ApplicationHeader";
import { StageSelector } from "@/components/custom/StageSelector";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ApplicationEditor from "@/components/custom/ApplicationEditor";
import { Application } from "@/types/application";
import StageToggle from "@/components/custom/StageToggle";
import { useStageManagement } from "@/hooks/useStageManagement";
import { useApplicationManagement } from "@/hooks/useApplicationManagement";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobSearchTracker() {
  const [editingAppId, setEditingAppId] = useState<string | null>(null);

  const {
    applications,
    setApplications,
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
  } = useStageManagement(applications, setApplications);

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

        {/* Applications list */}
        <div className="space-y-2 pt-3 pb-16">
          <h2 className="text-lg font-medium mb-2 flex">Your Applications</h2>

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
              {applications.map((app) => (
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
              {applications.length === 0 && (
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
