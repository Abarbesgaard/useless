import supabase from "@/lib/supabase";
import { ProfessionalInfo } from "../types/ProfessionalInfo";

// Professional Info CRUD
export const updateProfessionalInfo = async (
    userId: string,
    professionalData: ProfessionalInfo,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("professional_info")
            .upsert({ profile_id: userId, ...professionalData })
            .eq("profile_id", userId);

        if (error) {
            console.error("Error updating professional info:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error updating professional info:", error);
        return false;
    }
};
