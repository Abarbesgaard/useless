import supabase from "@/lib/supabase";
import { ProfessionalInfo } from "../types/ProfessionalInfo";

export const updateProfessionalInfo = async (
    userId: string,
    professionalData: ProfessionalInfo,
): Promise<boolean> => {
    try {
        console.log("=== DEBUGGING PROFESSIONAL INFO ===");
        console.log("userId:", userId);
        console.log("professionalData:", professionalData);

        // First ensure a profile exists
        console.log("Creating/updating profile...");
        const { data: profileData, error: profileError } = await supabase
            .from("profile")
            .upsert({
                id: userId,
                user_id: userId,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: "id",
            })
            .select();

        console.log("Profile upsert result:", { profileData, profileError });

        if (profileError) {
            console.error("Error creating/updating profile:", profileError);
            return false;
        }

        // Check if professional_info record exists first
        const { data: existingRecord } = await supabase
            .from("professional_info")
            .select("profile_id")
            .eq("profile_id", userId)
            .maybeSingle();

        console.log("Existing professional record:", existingRecord);

        if (existingRecord) {
            // Update existing record
            console.log("Updating existing professional info...");
            const { error } = await supabase
                .from("professional_info")
                .update({
                    current_title: professionalData.currentTitle,
                    years_experience: professionalData.yearsExperience,
                    salary_expectation: professionalData.salaryExpectation,
                    available_from: professionalData.availableFrom,
                    links: professionalData.links,
                    updated_at: new Date().toISOString(),
                })
                .eq("profile_id", userId);

            if (error) {
                console.error("Error updating professional info:", error);
                return false;
            }
        } else {
            // Insert new record
            console.log("Inserting new professional info...");
            const { error } = await supabase
                .from("professional_info")
                .insert({
                    profile_id: userId,
                    current_title: professionalData.currentTitle,
                    years_experience: professionalData.yearsExperience,
                    salary_expectation: professionalData.salaryExpectation,
                    available_from: professionalData.availableFrom,
                    links: professionalData.links,
                    updated_at: new Date().toISOString(),
                });

            if (error) {
                console.error("Error inserting professional info:", error);
                return false;
            }
        }

        console.log("=== SUCCESS ===");
        return true;
    } catch (error) {
        console.error("Unexpected error updating professional info:", error);
        return false;
    }
};

export const getProfessionalInfo = async (
    userId: string,
): Promise<ProfessionalInfo | null> => {
    try {
        const { data, error } = await supabase
            .from("professional_info")
            .select("*")
            .eq("profile_id", userId)
            .single();

        if (error && error.code !== "PGRST116") { // PGRST116 is "no rows returned"
            console.error("Error fetching professional info:", error);
            return null;
        }

        return data;
    } catch (error) {
        console.error("Unexpected error fetching professional info:", error);
        return null;
    }
};
