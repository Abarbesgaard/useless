import supabase from "@/lib/supabase";
import { WorkExperience } from "../types/WorkExperience";
export const addWorkExperience = async (
    userId: string,
    experienceData: Omit<WorkExperience, "id">, // Remove id from the type
): Promise<boolean> => {
    try {
        // Create insert data without the id field - let database auto-generate it
        const insertData = {
            profile_id: userId,
            company: experienceData.company,
            position: experienceData.position,
            period: experienceData.period,
            description: experienceData.description || null,
        };

        const { error } = await supabase
            .from("work_experience")
            .insert(insertData)
            .select();

        if (error) {
            console.error("Error adding work experience:", error);
            console.error(
                "Error details:",
                error.message,
                error.details,
                error.hint,
            );
            return false;
        }

        return true;
    } catch (error) {
        console.error("Unexpected error adding work experience:", error);
        return false;
    }
};

export const updateWorkExperience = async (
    experienceId: string,
    experienceData: WorkExperience,
): Promise<boolean> => {
    try {
        // Remove id and profile_id from update data since they shouldn't be updated
        const updateData = { ...experienceData };

        const cleanUpdateData = {
            company: updateData.company,
            position: updateData.position,
            period: updateData.period,
            description: updateData.description || null,
            updated_at: new Date().toISOString(), // Update the timestamp
        };

        const { error } = await supabase
            .from("work_experience")
            .update(cleanUpdateData)
            .eq("id", experienceId)
            .select(); // Return updated data

        if (error) {
            console.error("Error updating work experience:", error);
            console.error(
                "Error details:",
                error.message,
                error.details,
                error.hint,
            );
            return false;
        }

        return true;
    } catch (error) {
        console.error("Unexpected error updating work experience:", error);
        return false;
    }
};

export const deleteWorkExperience = async (
    experienceId: number,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("work_experience")
            .delete()
            .eq("id", experienceId);

        if (error) {
            console.error("Error deleting work experience:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error deleting work experience:", error);
        return false;
    }
};

export const getWorkExperiences = async (
    userId: string,
): Promise<WorkExperience[]> => {
    try {
        const { data, error } = await supabase
            .from("work_experience")
            .select("*")
            .eq("profile_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching work experiences:", error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error("Unexpected error fetching work experiences:", error);
        return [];
    }
};
