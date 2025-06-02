import supabase from "@/lib/supabase";
import { PersonalInfo } from "../types/PersonalInfo";

// Personal Info CRUD
export const updatePersonalInfo = async (
    userId: string,
    personalData: PersonalInfo,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("personal_info")
            .upsert({ profile_id: userId, ...personalData })
            .eq("profile_id", userId);

        if (error) {
            console.error("Error updating personal info:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error updating personal info:", error);
        return false;
    }
};
