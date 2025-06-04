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
export const getPersonalInfo = async (
    userId: string,
): Promise<PersonalInfo | null> => {
    try {
        const { data, error } = await supabase
            .from("personal_info")
            .select("*")
            .eq("profile_id", userId)
            .single();

        if (error) {
            if (error.code === "PGRST116") { // No rows returned
                return null;
            }
            console.error("Error fetching personal info:", error);
            return null;
        }

        return {
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            email: data.email || "",
            phone: data.phone || "",
            location: data.location || "",
            bio: data.bio || "",
        };
    } catch (error) {
        console.error("Unexpected error fetching personal info:", error);
        return null;
    }
};
