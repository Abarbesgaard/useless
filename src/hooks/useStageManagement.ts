import { useState } from "react";
import { updateApplication } from "../data/applications";
import { addStage, softDeleteStage } from "../data/stages";
import useAuth from "./useAuth";
import { toast } from "sonner";
import { Application } from "@/types/application";
import { Stage } from "@/types/stages";

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

    // Add a new stage to an application
    const addStageToApplication = async (appId: string, stage: Stage) => {
        if (!user) return;
        // Find the application to update
        const application = applications.find((app) => app.id === appId);
        if (!application) return;

        // Create the new stage object with a unique ID if it doesn't have one
        const newStage: Stage = {
            ...stage,
            id: crypto.randomUUID(), // Generate a random UUID if no ID is provided
            position: application.stages.length, // Set position to be after existing stages
            icon: stage.icon,
            is_active: false,
            is_deleted: false,
        };
        console.log(newStage.icon);

        try {
            console.log(appId);
            // First, save the stage to the database
            await addStage(newStage, appId);

            // Create updated application with new stage for local state
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

    // Delete a stage from an application
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
