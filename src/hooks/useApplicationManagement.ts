import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import {
    addApplicationWithCompanyAndContact,
    addCompanyApi,
    addContactApi,
    deleteApplication as deleteApplicationApi,
    getApplicationById,
    getApplicationsWithCompanies,
    getArchivedApplicationsByUser,
    getFavoriteApplicationsByUser,
    updateApplication as updateApplicationApi,
    updateArchiveStatus,
    updateCompanyApi,
    updateContactApi,
} from "../data/applications";
import { toast } from "sonner";
import { Application } from "@/types/application";
import { Company } from "@/types/company";
import { Contact } from "@/types/contact";

/**
 *  Custom hook for managing job applications.
 * @returns An object containing application data and functions to manage applications.
 */
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
        company_id: "",
        contact_id: "",
        created_at: "",
        updated_at: "",
        date: Date.now(),
    });

    useEffect(() => {
        fetchApplications();
    }, [user]);
    /**
     *  Fetches applications for the authenticated user.
     * @returns A promise that resolves when the applications are fetched.
     */
    const fetchApplications = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            if (!user) {
                throw new Error("User is not authenticated.");
            }

            console.log("🔍 Environment:", process.env.NODE_ENV);
            console.log("🔍 User ID:", user.id);
            console.log("🔍 User object:", user);

            const apps = await getApplicationsWithCompanies();
            console.log("🔍 Raw apps from getApplicationsWithCompanies:", apps);
            console.log("🔍 Apps count:", apps.length);

            const filteredApps = apps.filter((app) =>
                app.is_deleted === false &&
                app.is_archived === false
            );
            console.log("🔍 Filtered apps:", filteredApps);
            console.log("🔍 Filtered apps count:", filteredApps.length);

            const transformedApps = filteredApps.map((app) => {
                console.log("🔍 Transforming app:", app);
                return {
                    ...app,
                    user_id: user.id,
                    company: app.company_name,
                    date: new Date(app.date).getTime(),
                    currentStage: app.current_stage,
                    current_stage: app.current_stage,
                    stages: app.stages || [],
                    is_deleted: app.is_deleted,
                    is_archived: app.is_archived,
                    notes: app.notes || "",
                    url: app.url || "",
                    company_id: app.company_id ?? "",
                    contact_id: app.contact_id ?? "",
                };
            });

            console.log("🔍 Transformed apps:", transformedApps);

            const sortedApps = transformedApps.sort((a, b) => {
                if (a.favorite && !b.favorite) return -1;
                if (!a.favorite && b.favorite) return 1;
                return 0;
            });

            console.log("🔍 Final sorted apps:", sortedApps);
            setApplications(sortedApps);
        } catch (error) {
            console.error("❌ Error fetching applications:", error);
            setApplications([]);
        } finally {
            setIsLoading(false);
        }
    };
    /**
     *  Handles input changes in the application form.
     * @param e - The event object containing the input name and value.
     */
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setNewApp({ ...newApp, [name]: value });
    };
    /**
     *  Adds a new application to the list.
     * @returns A promise that resolves when the application is added.
     */
    const addApplication = async (
        companyInfo: Company,
        contactPerson: Contact,
    ) => {
        if (!user) return;
        try {
            const newAppData = await addApplicationWithCompanyAndContact({
                applicationData: {
                    company: newApp.company,
                    position: newApp.position,
                    notes: newApp.notes,
                    url: newApp.url || "",
                    date: newApp.date,
                    is_deleted: false,
                    is_archived: false,
                    currentStage: 0,
                    favorite: false,
                },
                companyData: {
                    name: companyInfo?.name || newApp.company,
                    phone: companyInfo?.phone || undefined,
                    email: companyInfo?.email || undefined,
                    website: companyInfo?.website || undefined,
                    notes: companyInfo?.notes || undefined,
                },
                contactData: contactPerson?.name
                    ? {
                        name: contactPerson.name,
                        email: contactPerson.email || undefined,
                        phone: contactPerson.phone || undefined,
                        position: contactPerson.position || undefined,
                        notes: contactPerson.notes || undefined,
                    }
                    : undefined,
            });

            // Rest of your function remains the same
            if (newAppData) {
                setApplications((prevApplications) => [
                    ...prevApplications,
                    {
                        ...newAppData,
                        date: new Date(newAppData.date).getTime(),
                        id: newAppData.id,
                        user_id: newAppData.user_id,
                        currentStage: newAppData.current_stage,
                        company_id: newAppData.company_id,
                        contact_id: newAppData.contact_id,
                        stages: newAppData.stages || [],
                    },
                ]);
                // ...
            }
        } catch (err) {
            console.error("Failed to add application:", err);
            toast.error("Failed to add application. Please try again.");
        }
    };
    /**
     *  Deletes an application from the list.
     * @param appId  - The ID of the application to be deleted.
     * @returns  A promise that resolves when the application is deleted.
     */
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
    /**
     *  Updates an existing application.
     * @param updatedApp  - The updated application object.
     * @returns  A promise that resolves when the application is updated.
     */
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
    /**
     *  Toggles the favorite status of an application.
     * @param appId  - The ID of the application to be toggled.
     * @returns  A promise that resolves when the favorite status is toggled.
     */
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
    /**
     *  Toggles the completion status of a stage in an application.
     * @param appId  - The ID of the application.
     * @param stageIndex  - The index of the stage to be toggled.
     * @returns A promise that resolves when the stage completion status is toggled.
     */
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
    /**
     * Fetches favorite applications for the authenticated user.
     * @returns A promise that resolves when the favorite applications are fetched.
     */
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
    /**
     * Fetches archived applications for the authenticated user.
     * @returns A promise that resolves when the archived applications are fetched.
     */
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
    /**
     * Toggles the archived status of an application.
     * @param app - The application object to be toggled.
     * @returns A promise that resolves when the archived status is toggled.
     */
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
    const fetchSpecificApplication = async (appId: string) => {
        if (!user) return;
        try {
            const app = await getApplicationById(appId);
            if (!app) {
                throw new Error("Application not found");
            }
            const transformedApp = {
                ...app,
                user_id: user.id,
                company: app.company,
                date: new Date(app.date).getTime(),
                currentStage: app.current_stage,
                current_stage: app.current_stage,
                stages: [],
                is_deleted: app.is_deleted,
                is_archived: app.is_archived,
                notes: app.notes || "",
                url: app.url || "",
                company_id: app.company_id ?? "",
                contact_id: app.contact_id ?? "",
            };
            setApplications((prevApps) =>
                prevApps.map((prevApp) =>
                    prevApp.id === appId ? transformedApp : prevApp
                )
            );
            return transformedApp;
        } catch (error) {
            console.error("Error fetching specific application:", error);
            toast.error("Failed to load application. Please try again.");
            return null;
        }
    };
    /**
     * Adds a new company to the list.
     * @param company - The company object to be added.
     * @returns A promise that resolves when the company is added.
     */
    const addCompany = async (company: Company) => {
        if (!user) return;
        try {
            const newCompany = await addCompanyApi({
                ...company,
                user_id: user.id,
            });
            toast.success("Company added successfully!");
            return newCompany;
        } catch (error) {
            console.error("Failed to add company:", error);
            toast.error("Failed to add company. Please try again.");
            throw error;
        }
    };

    /**
     * Updates an existing company in the database.
     * @param companyId - The ID of the company to update.
     * @param company - The updated company data.
     * @returns A promise that resolves to the updated company.
     */
    const updateCompany = async (companyId: string, company: Company) => {
        if (!user) return;
        try {
            const updatedCompany = await updateCompanyApi(companyId, {
                ...company,
                user_id: user.id,
            });
            toast.success("Company updated successfully!");
            return updatedCompany;
        } catch (error) {
            console.error("Failed to update company:", error);
            toast.error("Failed to update company. Please try again.");
            throw error;
        }
    };

    /**
     * Adds a new contact to the database.
     * @param contact - The contact object to be added.
     * @returns A promise that resolves to the created contact.
     */
    const addContact = async (contact: Contact) => {
        if (!user) return;
        try {
            const newContact = await addContactApi({
                ...contact,
                user_id: user.id,
            });
            toast.success("Contact added successfully!");
            return newContact;
        } catch (error) {
            console.error("Failed to add contact:", error);
            toast.error("Failed to add contact. Please try again.");
            throw error;
        }
    };

    /**
     * Updates an existing contact in the database.
     * @param contactId - The ID of the contact to update.
     * @param contact - The updated contact data.
     * @returns A promise that resolves to the updated contact.
     */
    const updateContact = async (contactId: string, contact: Contact) => {
        if (!user) return;
        try {
            const updatedContact = await updateContactApi(contactId, {
                ...contact,
                user_id: user.id,
            });
            toast.success("Contact updated successfully!");
            return updatedContact;
        } catch (error) {
            console.error("Failed to update contact:", error);
            toast.error("Failed to update contact. Please try again.");
            throw error;
        }
    };

    return {
        applications,
        setApplications,
        newApp,
        showAppForm,
        setShowAppForm,
        setNewApp,
        handleInputChange,
        fetchSpecificApplication,
        addApplication,
        deleteApplication,
        updateApplication,
        toggleFavorite,
        toggleStageCompletion,
        fetchApplications,
        fetchFavoriteApplications,
        toggleArchived,
        fetchArchivedApplications,
        addCompany,
        addContact,
        updateCompany,
        updateContact,
        isLoading,
    };
}
