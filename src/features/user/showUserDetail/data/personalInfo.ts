import supabase from "@/lib/supabase";
import { PersonalInfo } from "../types/PersonalInfo";

export const updatePersonalInfo = async (
    userId: string,
    personalData: PersonalInfo,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("personal_info")
            .upsert({
                user_id: userId,
                first_name: personalData.firstName,
                last_name: personalData.lastName,
                email: personalData.email,
                phone: personalData.phone,
                location: personalData.location,
                bio: personalData.bio,
                updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId);

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
