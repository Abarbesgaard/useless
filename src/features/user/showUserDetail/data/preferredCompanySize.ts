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
