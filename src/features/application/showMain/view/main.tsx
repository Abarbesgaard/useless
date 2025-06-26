import { useState } from "react";
import { Card, CardFooter } from "../../../../components/ui/card";
import { SidebarTrigger } from "../../../../components/ui/sidebar";
import { availableStages } from "../constants/availableStages";
import ApplicationHeader from "../components/ApplicationHeader";
import { StageSelector } from "../components/StageSelector";
import StageToggle from "../components/StageToggle";
import { useStageManagement } from "../hooks/useStageManagement";
import { useApplicationManagement } from "../hooks/useApplicationManagement";
import { useTranslation } from "react-i18next";
import { ApplicationLoadingSkeleton } from "../components/skeleton/ApplicationSkeletonLoading";

export default function Main() {
  const { t } = useTranslation("application");
  const [editingAppId, setEditingAppId] = useState<string | null>(null);

  const {
    applications,
    setApplications,
    deleteApplication,
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



  return (
    <div className="flex h-screen w-screen overflow-hidden ">
      <SidebarTrigger className="cursor-pointer" />
      <div className="w-full h-full overflow-y-auto">
        <h2 className="text-lg font-medium mb-2 flex">{t("title")}</h2>
        <div className="space-y-2 pt-3 pb-16">
          {isLoading ? (
            <ApplicationLoadingSkeleton />
          )
            : (
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

                      <div className="flex flex-wrap items-center pl-6">
                        <StageToggle
                          app={app}
                          toggleStageCompletion={toggleStageCompletion}
                          deleteStage={deleteStage}
                        />
                        <div className="flex items-center">
                          <div className="h-0.5 w-8 bg-sidebar-ring mx-1 "></div>
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
                      <CardFooter className="flex justify-between items-center p-4"></CardFooter>
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
