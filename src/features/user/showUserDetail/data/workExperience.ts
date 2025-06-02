import supabase from "@/lib/supabase";
import { WorkExperience } from "../types/WorkExperience";

// Work Experience CRUD
export const addWorkExperience = async (
    userId: string,
    experienceData: WorkExperience,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("work_experience")
            .insert({ profile_id: userId, ...experienceData });

        if (error) {
            console.error("Error adding work experience:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error adding work experience:", error);
        return false;
    }
};

export const updateWorkExperience = async (
    experienceId: number,
    experienceData: WorkExperience,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("work_experience")
            .update(experienceData)
            .eq("id", experienceId);

        if (error) {
            console.error("Error updating work experience:", error);
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
