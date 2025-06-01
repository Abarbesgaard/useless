import supabase from "@/lib/supabase";
interface PersonalInfo {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    location?: string;
    bio?: string;
}
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

// Professional Info CRUD
export const updateProfessionalInfo = async (
    userId: string,
    professionalData: {
        current_title?: string;
        years_experience?: string;
        salary_expectation?: string;
        available_from?: string;
        portfolio_url?: string;
        linkedin_url?: string;
        github_url?: string;
        cv_url?: string;
    },
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
