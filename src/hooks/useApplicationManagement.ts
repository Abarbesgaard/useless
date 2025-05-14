import { useEffect, useState } from "react";
import { defaultInitialStages } from "../constants/defaultInitialStages";
import useAuth from "./useAuth";
import {
    addApplication as addApplicationApi,
    deleteApplication as deleteApplicationApi,
    getApplicationsByUser,
    getArchivedApplicationsByUser,
    getFavoriteApplicationsByUser,
    updateApplication as updateApplicationApi,
    updateArchiveStatus,
} from "../data/applications";
import { toast } from "sonner";
import { Application } from "@/types/application";

export function useApplicationManagement() {
    const { user } = useAuth();
    const [applications, setApplications] = useState<Application[]>([]);
    const [showAppForm, setShowAppForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newApp, setNewApp] = useState({
        company: "",
        position: "",
        notes: "",
        url: "",
        date: Date.now(),
    });

    useEffect(() => {
        fetchApplications();
    }, [user]);

    const fetchApplications = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            if (!user) {
                throw new Error("User is not authenticated.");
            }
            const apps = await getApplicationsByUser(user.id);
            const sortedApps = apps.sort((a, b) => {
                if (a.favorite && !b.favorite) return -1;
                if (!a.favorite && b.favorite) return 1;
                return 0;
            });

            setApplications(sortedApps);
        } catch (error) {
            console.error("Error fetching applications:", error);
            setApplications([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setNewApp({ ...newApp, [name]: value });
    };

    const addApplication = async () => {
        if (!user) return;
        try {
            const newAppData = await addApplicationApi({
                ...newApp,
                id: "",
                user_id: user.id,
                currentStage: 0,
                stages: [...defaultInitialStages],
                is_deleted: false,
                favorite: false,
                is_archived: false,
            });

            if (newAppData) {
                setApplications((prevApplications) => [
                    ...prevApplications,
                    {
                        ...newAppData,
                        date: new Date(newAppData.date).getTime(),
                        stages: newAppData.stages || [],
                    },
                ]);

                setShowAppForm(false);

                // Show success toast
                toast("Application added successfully!", {
                    description:
                        `"${newApp.company}" has been added to your applications.`,
                });
            }
        } catch (err) {
            console.error("Failed to add application:", err);
            toast.error("Failed to add application. Please try again.");
        }
    };

    const deleteApplication = async (appId: string) => {
        if (!user) return;

        try {
            const result = await deleteApplicationApi(appId);
            if (result && result.success) {
                setApplications(applications.filter((app) => app.id !== appId));
                toast("Application deleted successfully!", {
                    description:
                        "The application has been removed from your list.",
                });
            }
        } catch (err) {
            console.error("Failed to delete application:", err);
            toast.error("Failed to delete application. Please try again.");
        }
    };

    const updateApplication = async (updatedApp: Application) => {
        if (!user) return;

        try {
            await updateApplicationApi({
                ...updatedApp,
                user_id: user.id,
                is_deleted: updatedApp.is_deleted,
                stages: updatedApp.stages,
                favorite: updatedApp.favorite,
                is_archived: updatedApp.is_archived,
            });

            setApplications(
                applications.map((
                    app,
                ) => (app.id === updatedApp.id ? updatedApp : app)),
            );

            return true;
        } catch (error) {
            console.error("Failed to update application:", error);
            toast.error("Failed to update application. Please try again.");
            return false;
        }
    };

    const toggleFavorite = async (appId: string) => {
        if (!user) return;

        // Update the favorite state for the application locally
        const updatedApps = applications.map((app) => {
            if (app.id === appId) {
                const updatedApp = { ...app, favorite: !app.favorite };
                // Persist the favorite change to the database
                updateApplicationApi({
                    ...updatedApp,
                    user_id: user.id,
                    is_deleted: updatedApp.is_deleted,
                    stages: updatedApp.stages,
                    favorite: updatedApp.favorite,
                    is_archived: updatedApp.is_archived,
                });
                return updatedApp;
            }
            return app;
        });

        // Re-sort the applications to keep the favorited ones at the top
        const sortedApps = updatedApps.sort((a, b) => {
            if (a.favorite && !b.favorite) return -1;
            if (!a.favorite && b.favorite) return 1;
            return 0; // Keep the original order if both are in the same state
        });

        // Update the local state with the sorted applications
        setApplications(sortedApps);

        // Show a toast to indicate success
        toast(
            `Application ${
                updatedApps.find((app) => app.id === appId)?.favorite
                    ? "added to"
                    : "removed from"
            } favorites!`,
        );
    };

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
            applications.map((app) => (app.id === appId ? updatedApp : app)),
        );

        try {
            // Persist changes to the database
            await updateApplicationApi({
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
                applications.map((
                    app,
                ) => (app.id === appId ? currentApp : app)),
            );
        }
    };

    const fetchFavoriteApplications = async () => {
        if (!user) return;
        try {
            const favoriteApps = await getFavoriteApplicationsByUser(user.id);
            const sortedApps = favoriteApps.sort((a, b) => {
                if (a.favorite && !b.favorite) return -1;
                if (!a.favorite && b.favorite) return 1;
                return 0; // Otherwise, keep the same order
            });
            setApplications(sortedApps);
        } catch (error) {
            console.error("Error fetching favorite applications:", error);
            setApplications([]); // Set to empty array on error
            toast.error(
                "Failed to load favorite applications. Please try again.",
            );
        }
    };

    const fetchArchivedApplications = async () => {
        if (!user) return;
        try {
            const archivedApps = await getArchivedApplicationsByUser(user.id);

            const sortedApps = archivedApps.sort((a, b) => {
                if (a.is_archived && !b.is_archived) return -1;
                if (!a.is_archived && b.is_archived) return 1;
                return 0;
            });
            setApplications(sortedApps);
        } catch (error) {
            console.error("Error fetching archived applications:", error);
            setApplications([]); // Set to empty array on error
            toast.error(
                "Failed to load archived applications. Please try again.",
            );
        }
    };

    const toggleArchived = async (app: Application) => {
        if (!user) return;
        try {
            const updatedApp = await updateArchiveStatus(app);

            setApplications(
                applications.map((a) => (a.id === app.id ? updatedApp : a)),
            );

            toast(
                `Application ${
                    updatedApp.is_archived ? "archived" : "unarchived"
                }!`,
                {
                    description: `The application has been ${
                        updatedApp.is_archived ? "archived" : "unarchived"
                    } successfully.`,
                },
            );
        } catch (error) {
            console.error("Failed to update archive status:", error);
            toast.error("Failed to update archive status. Please try again.");
        }
    };

    return {
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
        fetchApplications,
        fetchFavoriteApplications,
        toggleArchived,
        fetchArchivedApplications,
        isLoading,
    };
}
