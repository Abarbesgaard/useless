import supabase from "@/lib/supabase";
import { ProfessionalInfo } from "../types/ProfessionalInfo";

export const updateProfessionalInfo = async (
    userId: string,
    professionalData: ProfessionalInfo,
): Promise<boolean> => {
    try {
        const { error: profileError } = await supabase
            .from("profile")
            .upsert({
                id: userId,
                user_id: userId,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: "id",
            })
            .select();

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

        return {
            currentTitle: data.current_title,
            yearsExperience: data.years_experience,
            salaryExpectation: data.salary_expectation,
            availableFrom: data.available_from,
            links: data.links,
        };
    } catch (error) {
        console.error("Unexpected error fetching professional info:", error);
        return null;
    }
};
