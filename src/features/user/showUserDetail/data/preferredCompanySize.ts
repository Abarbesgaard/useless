import supabase from "@/lib/supabase";
import { PreferredCompanySize } from "../types/PreferredCompanySize";

// Company Size Preferences CRUD
export const addPreferredCompanySize = async (
    userId: string,
    companySize: PreferredCompanySize,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("preferred_company_size")
            .insert({ profile_id: userId, ...companySize });

        if (error) {
            console.error("Error adding preferred company size:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error adding preferred company size:", error);
        return false;
    }
};

export const deletePreferredCompanySize = async (
    sizeId: string,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("preferred_company_size")
            .delete()
            .eq("id", sizeId);

        if (error) {
            console.error("Error deleting preferred company size:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error(
            "Unexpected error deleting preferred company size:",
            error,
        );
        return false;
    }
};

export const getPreferredCompanySizes = async (
    userId: string,
): Promise<string[]> => {
    try {
        const { data, error } = await supabase
            .from("preferred_company_size")
            .select("company_size")
            .eq("profile_id", userId);

        if (error) {
            console.error("Error fetching preferred company sizes:", error);
            return [];
        }

        return data?.map((item) => item.company_size) || [];
    } catch (error) {
        console.error(
            "Unexpected error fetching preferred company sizes:",
            error,
        );
        return [];
    }
};

export const updatePreferredCompanySizes = async (
    userId: string,
    companySizes: string[],
): Promise<boolean> => {
    try {
        // First ensure a profile exists - remove onConflict parameter
        const { error: profileError } = await supabase
            .from("profile")
            .upsert({
                id: userId,
                updated_at: new Date().toISOString(),
            });

        if (profileError) {
            console.error("Error creating/updating profile:", profileError);
            return false;
        }

        // Delete existing preferred company sizes
        await supabase
            .from("preferred_company_size")
            .delete()
            .eq("profile_id", userId);

        // Insert new company sizes
        if (companySizes.length > 0) {
            const companySizesData = companySizes.map((size) => ({
                profile_id: userId,
                company_size: size,
            }));

            const { error } = await supabase
                .from("preferred_company_size")
                .insert(companySizesData);

            if (error) {
                console.error(
                    "Error inserting preferred company sizes:",
                    error,
                );
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error(
            "Unexpected error updating preferred company sizes:",
            error,
        );
        return false;
    }
};
