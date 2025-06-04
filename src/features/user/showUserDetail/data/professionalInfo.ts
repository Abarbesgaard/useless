import supabase from "@/lib/supabase";
import { ProfessionalInfo } from "../types/ProfessionalInfo";

export const updateProfessionalInfo = async (
    userId: string,
    professionalData: ProfessionalInfo,
): Promise<boolean> => {
    try {
        console.log("=== UPDATING PROFESSIONAL INFO ===");
        console.log("User ID:", userId);
        console.log("Professional data:", professionalData);

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

        console.log("Final profile check:", {
            profileCheck,
            profileCheckError,
        });

        if (profileCheckError || !profileCheck) {
            console.error("Profile still doesn't exist after creation attempt");
            return false;
        }

        // Step 4: Check if professional_info record exists
        // Fix: Use 'id' instead of 'profile_id' to match the foreign key constraint
        const { data: existingRecord, error: recordCheckError } = await supabase
            .from("professional_info")
            .select("id")
            .eq("id", userId) // Changed from profile_id to id
            .maybeSingle();

        console.log("Professional info check:", {
            existingRecord,
            recordCheckError,
        });

        if (recordCheckError && recordCheckError.code !== "PGRST116") {
            console.error(
                "Error checking for existing professional info:",
                recordCheckError,
            );
            return false;
        }

        // Step 5: Update or insert
        if (existingRecord) {
            console.log("Updating existing professional info");

            const { data: updateResult, error: updateError } = await supabase
                .from("professional_info")
                .update({
                    current_title: professionalData.currentTitle,
                    years_experience: professionalData.yearsExperience,
                    salary_expectation: professionalData.salaryExpectation,
                    available_from: professionalData.availableFrom,
                    links: professionalData.links,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", userId) // Changed from profile_id to id
                .select("*");

            console.log("Update result:", { updateResult, updateError });

            if (updateError) {
                console.error("Error updating professional info:", updateError);
                return false;
            }
        } else {
            console.log("Inserting new professional info");

            const insertData = {
                id: userId, // Changed from profile_id to id to match foreign key constraint
                current_title: professionalData.currentTitle,
                years_experience: professionalData.yearsExperience,
                salary_expectation: professionalData.salaryExpectation,
                available_from: professionalData.availableFrom,
                links: professionalData.links,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            console.log("Insert data:", insertData);

            const { data: insertResult, error: insertError } = await supabase
                .from("professional_info")
                .insert(insertData)
                .select("*");

            console.log("Insert result:", { insertResult, insertError });

            if (insertError) {
                console.error(
                    "Error inserting professional info:",
                    insertError,
                );
                return false;
            }
        }

        console.log("Professional info update completed successfully");
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
            .eq("id", userId) // Changed from profile_id to id
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
const ensureProfileExists = async (userId: string): Promise<boolean> => {
    try {
        console.log("=== ENSURING PROFILE EXISTS ===");
        console.log("User ID:", userId);

        // Check if profile already exists
        const { data: existingProfile, error: checkError } = await supabase
            .from("profile")
            .select("*")
            .eq("id", userId)
            .maybeSingle();

        console.log("Profile check result:", { existingProfile, checkError });

        if (checkError && checkError.code !== "PGRST116") {
            console.error("Error checking for profile:", checkError);
            return false;
        }

        if (existingProfile) {
            console.log("Profile already exists:", existingProfile);
            return true;
        }

        // Get current user to ensure we have the right data
        const { data: { user }, error: userError } = await supabase.auth
            .getUser();
        console.log("Current user data:", { user, userError });

        if (userError || !user) {
            console.error("No authenticated user found:", userError);
            return false;
        }

        // Try different approaches for profile creation
        console.log("Creating new profile - Attempt 1: Basic insert");

        const profileData = {
            id: userId,
            user_id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        console.log("Profile data to insert:", profileData);

        const { data: newProfile, error: insertError } = await supabase
            .from("profile")
            .insert(profileData)
            .select("*")
            .single();

        console.log("Insert result:", { newProfile, insertError });

        if (insertError) {
            console.error("Profile creation failed with error:", insertError);

            // Try with upsert instead
            console.log("Trying with upsert instead...");

            const { data: upsertProfile, error: upsertError } = await supabase
                .from("profile")
                .upsert(profileData, {
                    onConflict: "id",
                    ignoreDuplicates: false,
                })
                .select("*")
                .single();

            console.log("Upsert result:", { upsertProfile, upsertError });

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

        console.log("Profile verification:", { verifyProfile, verifyError });

        return !!verifyProfile && !verifyError;
    } catch (error) {
        console.error("Unexpected error ensuring profile exists:", error);
        return false;
    }
};
