import supabase from "@/lib/supabase";
import { Profile } from "../types/profile";

/**
 * Fetches the comprehensive profile of a user by their ID, including all related data.
 * @param userId - The ID of the user whose profile is to be fetched.
 * @returns A Promise that resolves to the user's complete profile or null if not found or an error occurs.
 */
export const getProfile = async (userId: string): Promise<Profile | null> => {
    try {
        const { data, error } = await supabase
            .from("profiles")
            .select(`
                *,
                personal_info(
                    first_name,
                    last_name,
                    email,
                    phone,
                    location,
                    bio
                ),
                professional_info(
                    current_title,
                    years_experience,
                    salary_expectation,
                    available_from,
                    portfolio_url,
                    linkedin_url,
                    github_url,
                    cv_url
                ),
                technical_skills(
                    id,
                    skill_name
                ),
                soft_skills(
                    id,
                    skill_name
                ),
                interests(
                    id,
                    interest_name
                ),
                languages(
                    id,
                    language_name,
                    proficiency_level
                ),
                work_experience(
                    id,
                    company,
                    position,
                    period,
                    description
                ),
                education(
                    id,
                    institution,
                    degree,
                    period,
                    grade
                ),
                preferred_roles(
                    id,
                    role_name
                ),
                preferred_company_size(
                    id,
                    company_size
                ),
                work_arrangement(
                    id,
                    arrangement_type
                ),
                industries(
                    id,
                    industry_name
                )
            `)
            .eq("id", userId)
            .single();

        if (error) {
            console.error("Error fetching comprehensive profile:", error);
            return null;
        }

        return data as Profile;
    } catch (error) {
        console.error("Unexpected error:", error);
        return null;
    }
};

// Profile Management
export const createProfile = async (userId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("profiles")
            .insert({ id: userId });

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
        // This will cascade delete all related data due to ON DELETE CASCADE
        const { error } = await supabase
            .from("profiles")
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
