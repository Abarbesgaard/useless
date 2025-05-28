import { Company } from "../types/company";
import useAuth from "./useAuth";
import { addCompanyApi, updateCompanyApi } from "../data/applications";
import { useApplicationManagement } from "./useApplicationManagement";
import { toast } from "sonner";

export const useCompanyManagement = () => {
    const { user } = useAuth();
    const { updateApplicationReferences } = useApplicationManagement();
    /**
     * Updates an existing company in the database.
     * @param companyId - The ID of the company to update.
     * @param company - The updated company data.
     * @returns A promise that resolves to the updated company.
     */
    const updateCompany = async (
        companyId: string,
        company: Company,
        applicationId: string,
    ) => {
        if (!user) return;
        try {
            const updatedCompany = await updateCompanyApi(companyId, {
                ...company,
                user_id: user.id,
            });

            if (applicationId) {
                await updateApplicationReferences(applicationId, {
                    company_id: companyId,
                });
            }

            toast.success("Company updated successfully!");
            return updatedCompany;
        } catch (error) {
            console.error("Failed to update company:", error);
            toast.error("Failed to update company. Please try again.");
            throw error;
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

    return {
        updateCompany,
        addCompany,
    };
};
