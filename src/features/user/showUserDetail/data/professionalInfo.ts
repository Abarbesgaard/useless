import supabase from "@/lib/supabase";
import { ProfessionalInfo } from "../types/ProfessionalInfo";

export const getProfessionalInfo = async (
    userId: string,
): Promise<ProfessionalInfo | null> => {
    try {
        const { data, error } = await supabase
            .from("professional_info")
            .select("*")
            .eq("profile_id", userId) // Back to profile_id
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

export const updateProfessionalInfo = async (
    userId: string,
    professionalData: ProfessionalInfo,
): Promise<boolean> => {
    try {
        // Step 1: Ensure profile exists
        const profileExists = await ensureProfileExists(userId);
        if (!profileExists) {
            console.error(
                "Failed to ensure profile exists - aborting professional info update",
            );
            return false;
        }

        // Step 2: Wait a bit to ensure profile creation is committed
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Step 3: Double-check profile exists
        const { data: profileCheck, error: profileCheckError } = await supabase
            .from("profile")
            .select("id")
            .eq("id", userId)
            .single();

        if (profileCheckError || !profileCheck) {
            console.error("Profile still doesn't exist after creation attempt");
            return false;
        }

        // Step 4: Check if professional_info record exists
        const { data: existingRecord, error: recordCheckError } = await supabase
            .from("professional_info")
            .select("id")
            .eq("profile_id", userId) // Back to profile_id
            .maybeSingle();

        if (recordCheckError && recordCheckError.code !== "PGRST116") {
            console.error(
                "Error checking for existing professional info:",
                recordCheckError,
            );
            return false;
        }

        // Step 5: Update or insert
        if (existingRecord) {
            const { error: updateError } = await supabase
                .from("professional_info")
                .update({
                    current_title: professionalData.currentTitle,
                    years_experience: professionalData.yearsExperience,
                    salary_expectation: professionalData.salaryExpectation,
                    available_from: professionalData.availableFrom,
                    links: professionalData.links,
                    updated_at: new Date().toISOString(),
                })
                .eq("profile_id", userId) // Back to profile_id
                .select("*");

            if (updateError) {
                console.error("Error updating professional info:", updateError);
                return false;
            }
        } else {
            const insertData = {
                profile_id: userId, // Back to profile_id
                current_title: professionalData.currentTitle,
                years_experience: professionalData.yearsExperience,
                salary_expectation: professionalData.salaryExpectation,
                available_from: professionalData.availableFrom,
                links: professionalData.links,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            // Try insert with upsert to handle potential race conditions
            const { error: insertError } = await supabase
                .from("professional_info")
                .upsert(insertData, {
                    onConflict: "profile_id",
                    ignoreDuplicates: false,
                })
                .select("*");

            if (insertError) {
                console.error(
                    "Error inserting professional info:",
                    insertError,
                );
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error("Unexpected error updating professional info:", error);
        return false;
    }
};

const ensureProfileExists = async (userId: string): Promise<boolean> => {
    try {
        // Check if profile already exists
        const { data: existingProfile, error: checkError } = await supabase
            .from("profile")
            .select("*")
            .eq("id", userId)
            .maybeSingle();

        if (checkError && checkError.code !== "PGRST116") {
            console.error("Error checking for profile:", checkError);
            return false;
        }

        if (existingProfile) {
            return true;
        }

        // Get current user to ensure we have the right data
        const { data: { user }, error: userError } = await supabase.auth
            .getUser();

        if (userError || !user) {
            console.error("No authenticated user found:", userError);
            return false;
        }

        const profileData = {
            id: userId,
            user_id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        const { error: insertError } = await supabase
            .from("profile")
            .insert(profileData)
            .select("*")
            .single();

        if (insertError) {
            console.error("Profile creation failed with error:", insertError);

            const { error: upsertError } = await supabase
                .from("profile")
                .upsert(profileData, {
                    onConflict: "id",
                    ignoreDuplicates: false,
                })
                .select("*")
                .single();

            if (upsertError) {
                console.error("Upsert also failed:", upsertError);
                return false;
            }
        }

        // Verify the profile was created
        const { data: verifyProfile, error: verifyError } = await supabase
            .from("profile")
            .select("*")
            .eq("id", userId)
            .single();

        return !!verifyProfile && !verifyError;
    } catch (error) {
        console.error("Unexpected error ensuring profile exists:", error);
        return false;
    }
};
