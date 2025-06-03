import supabase from "@/lib/supabase";
import { Profile } from "../types/Profile";
import { PersonalInfo } from "../types/PersonalInfo";

/**
 * Fetches the comprehensive profile of a user by their ID, including all related data.
 * @param userId - The ID of the user whose profile is to be fetched.
 * @returns A Promise that resolves to the user's complete profile or null if not found or an error occurs.
 */
export const getProfile = async (userId: string): Promise<Profile | null> => {
    try {
        // First get the basic profile - change from "profiles" to "profile"
        const { data: profileData, error: profileError } = await supabase
            .from("profile") // Changed from "profiles" to "profile"
            .select("*")
            .eq("id", userId)
            .single();

        if (profileError || !profileData) {
            console.error("Error fetching profile:", profileError);
            return null;
        }

        // Then get all related data in parallel
        const [
            personalInfo,
            professionalInfo,
            technicalSkills,
            softSkills,
            interests,
            languages,
            workExperience,
            education,
            preferredRoles,
            preferredCompanySize,
            workArrangement,
            industries,
        ] = await Promise.all([
            supabase.from("personal_info").select("*").eq("profile_id", userId)
                .maybeSingle(), // Changed to profile_id
            supabase.from("professional_info").select("*").eq(
                "profile_id",
                userId,
            ).maybeSingle(), // Changed to profile_id
            supabase.from("technical_skills").select("*").eq(
                "profile_id",
                userId,
            ), // Changed to profile_id
            supabase.from("soft_skills").select("*").eq("profile_id", userId), // Changed to profile_id
            supabase.from("interests").select("*").eq("profile_id", userId), // Changed to profile_id
            supabase.from("languages").select("*").eq("profile_id", userId), // Changed to profile_id
            supabase.from("work_experience").select("*").eq(
                "profile_id",
                userId,
            ), // Changed to profile_id
            supabase.from("education").select("*").eq("profile_id", userId), // Changed to profile_id
            supabase.from("preferred_roles").select("*").eq(
                "profile_id",
                userId,
            ), // Changed to profile_id
            supabase.from("preferred_company_size").select("*").eq(
                "profile_id",
                userId,
            ), // Changed to profile_id
            supabase.from("work_arrangement").select("*").eq(
                "profile_id",
                userId,
            ), // Changed to profile_id
            supabase.from("industries").select("*").eq("profile_id", userId), // Changed to profile_id
        ]);

        // Combine all the data
        const completeProfile = {
            ...profileData,
            personal_info: personalInfo.data,
            professional_info: professionalInfo.data,
            technical_skills: technicalSkills.data || [],
            soft_skills: softSkills.data || [],
            interests: interests.data || [],
            languages: languages.data || [],
            work_experience: workExperience.data || [],
            education: education.data || [],
            preferred_roles: preferredRoles.data || [],
            preferred_company_size: preferredCompanySize.data || [],
            work_arrangement: workArrangement.data || [],
            industries: industries.data || [],
        };

        return completeProfile as Profile;
    } catch (error) {
        console.error("Unexpected error:", error);
        return null;
    }
};

// Profile Management
export const createProfile = async (userId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("profile")
            .insert({
                id: userId,
                user_id: userId, // Add this line
            });

        if (error) {
            console.error("Error creating profile:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error creating profile:", error);
        return false;
    }
};

export const deleteProfile = async (userId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("profile") // Changed from "profiles" to "profile"
            .delete()
            .eq("id", userId);

        if (error) {
            console.error("Error deleting profile:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error deleting profile:", error);
        return false;
    }
};
export const updatePersonalInfo = async (
    userId: string,
    personalData: PersonalInfo,
): Promise<boolean> => {
    try {
        // First ensure a profile exists
        const { error: profileError } = await supabase
            .from("profile")
            .upsert({
                id: userId,
                user_id: userId,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: "id",
            });

        if (profileError) {
            console.error("Error creating/updating profile:", profileError);
            return false;
        }

        // Check if personal_info record exists first
        const { data: existingRecord } = await supabase
            .from("personal_info")
            .select("profile_id")
            .eq("profile_id", userId)
            .maybeSingle();

        if (existingRecord) {
            // Update existing record
            const { error } = await supabase
                .from("personal_info")
                .update({
                    first_name: personalData.firstName,
                    last_name: personalData.lastName,
                    email: personalData.email,
                    phone: personalData.phone,
                    location: personalData.location,
                    bio: personalData.bio,
                    updated_at: new Date().toISOString(),
                })
                .eq("profile_id", userId);

            if (error) {
                console.error("Error updating personal info:", error);
                return false;
            }
        } else {
            // Insert new record
            const { error } = await supabase
                .from("personal_info")
                .insert({
                    profile_id: userId,
                    first_name: personalData.firstName,
                    last_name: personalData.lastName,
                    email: personalData.email,
                    phone: personalData.phone,
                    location: personalData.location,
                    bio: personalData.bio,
                    updated_at: new Date().toISOString(),
                });

            if (error) {
                console.error("Error inserting personal info:", error);
                return false;
            }
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
