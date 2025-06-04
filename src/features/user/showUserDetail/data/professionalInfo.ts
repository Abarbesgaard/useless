import supabase from "@/lib/supabase";
import { ProfessionalInfo } from "../types/ProfessionalInfo";

export const updateProfessionalInfo = async (
    userId: string,
    professionalData: ProfessionalInfo,
): Promise<boolean> => {
    try {
        // First ensure a profile exists - create it if it doesn't exist
        const { data: existingProfile } = await supabase
            .from("profile")
            .select("id")
            .eq("id", userId)
            .maybeSingle();

        if (!existingProfile) {
            // Create the profile first
            const { error: profileCreateError } = await supabase
                .from("profile")
                .insert({
                    id: userId,
                    user_id: userId,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (profileCreateError) {
                console.error("Error creating profile:", profileCreateError);
                return false;
            }
        }

        // Check if professional_info record exists first
        const { data: existingRecord } = await supabase
            .from("professional_info")
            .select("profile_id")
            .eq("profile_id", userId)
            .maybeSingle();

        if (existingRecord) {
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
            // Insert new record with the confirmed profile ID
            const { error } = await supabase
                .from("professional_info")
                .insert({
                    profile_id: userId,
                    current_title: professionalData.currentTitle,
                    years_experience: professionalData.yearsExperience,
                    salary_expectation: professionalData.salaryExpectation,
                    available_from: professionalData.availableFrom,
                    links: professionalData.links,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });

            if (error) {
                console.error("Error inserting professional info:", error);
                return false;
            }
        }

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

        if (error && error.code !== "PGRST116") {
            console.error("Error fetching professional info:", error);
            return null;
        }

        // Add null check for data
        if (!data) {
            return null;
        }

        return {
            currentTitle: data.current_title || "",
            yearsExperience: data.years_experience || "",
            salaryExpectation: data.salary_expectation || "",
            availableFrom: data.available_from || "",
            links: data.links || null,
        };
    } catch (error) {
        console.error("Unexpected error fetching professional info:", error);
        return null;
    }
};
