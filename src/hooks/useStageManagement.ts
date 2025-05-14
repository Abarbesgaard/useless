import { useState } from "react";
import { updateApplication } from "../data/applications";
import { addStage, softDeleteStage } from "../data/stages";
import useAuth from "./useAuth";
import { toast } from "sonner";
import { Application } from "@/types/application";
import { Stage, StageForPersistence } from "@/types/stages";

export function useStageManagement(
    applications: Application[],
    setApplications: React.Dispatch<React.SetStateAction<Application[]>>,
) {
    const { user } = useAuth();
    const [stageSelectorApp, setStageSelectorApp] = useState<string | null>(
        null,
    );

    // Toggle stage selector visibility
    const toggleStageSelector = (appId: string | null) => {
        setStageSelectorApp(appId === stageSelectorApp ? null : appId);
    };
    /**
     * This function adds a new stage to an application.
     * @param appId - The ID of the application to which the stage will be added.
     * @param stage - The stage object containing the details of the new stage.
     * @returns A promise that resolves when the stage is added.
     */
    const addStageToApplication = async (appId: string, stage: Stage) => {
        if (!user) return;
        const application = applications.find((app) => app.id === appId);
        if (!application) return;

        const newStage: Stage = {
            ...stage,
            id: crypto.randomUUID(),
            position: application.stages.length,
            icon: stage.icon,
            is_active: false,
            is_deleted: false,
        };

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { category, ...stageForPersistence } = newStage;

            await addStage(stageForPersistence as StageForPersistence, appId);

            const updatedApp = {
                ...application,
                stages: [...application.stages, newStage],
            };

            // Update local state
            setApplications(
                applications.map((
                    app,
                ) => (app.id === appId ? updatedApp : app)),
            );

            // Close the stage selector
            setStageSelectorApp(null);

            // Show success toast
            toast.success("Stage added", {
                description:
                    `"${stage.name}" stage has been added to this application.`,
            });
        } catch (error) {
            console.error("Failed to add stage:", error);
            toast.error("Failed to add stage. Please try again.");
        }
    };

    /**
     * Deletes a stage from an application.
     * @param appId - The ID of the application.
     * @param stageIndex - The index of the stage to delete.
     * @returns A promise that resolves when the stage is deleted.
     * @throws An error if the stage cannot be deleted.
     */
    const deleteStage = async (appId: string, stageIndex: number) => {
        if (!user) return;

        // Find the application to update
        const application = applications.find((app) => app.id === appId);
        if (!application) return;

        // Make sure the stage index is valid
        if (stageIndex < 0 || stageIndex >= application.stages.length) return;

        // Get the stage to delete
        const stageToDelete = application.stages[stageIndex];

        softDeleteStage(stageToDelete.id);
        // Create new stages array without the deleted stage
        const updatedStages = [...application.stages];
        updatedStages.splice(stageIndex, 1);

        // Adjust currentStage if necessary
        let updatedCurrentStage = application.currentStage;

        if (stageIndex <= application.currentStage) {
            updatedCurrentStage = Math.max(0, updatedCurrentStage - 1);
        }

        // Create updated application
        const updatedApp = {
            ...application,
            stages: updatedStages,
            currentStage: updatedCurrentStage,
        };

        try {
            // Update in database
            await updateApplication({
                ...updatedApp,
                user_id: user.id,
                is_deleted: false,
            });

            // Update local state
            setApplications(
                applications.map((
                    app,
                ) => (app.id === appId ? updatedApp : app)),
            );

            // Show success toast
            toast.success("Stage removed", {
                description: `"${
                    stageToDelete?.name || "Selected"
                }" stage has been removed.`,
            });
        } catch (error) {
            console.error("Failed to delete stage:", error);
            toast.error("Failed to delete stage. Please try again.");
        }
    };

    return {
        stageSelectorApp,
        toggleStageSelector,
        addStageToApplication: addStageToApplication as (
            appId: string,
            stage: Stage,
        ) => void,
        deleteStage: deleteStage as (
            appId: string,
            stageIndex: number,
        ) => Promise<void>,
    };
}
