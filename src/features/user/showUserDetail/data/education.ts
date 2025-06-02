import supabase from "@/lib/supabase";
import { Education } from "../types/Education";

// Education CRUD
export const addEducation = async (
    userId: string,
    educationData: Education,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("education")
            .insert({ profile_id: userId, ...educationData });

        if (error) {
            console.error("Error adding education:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error adding education:", error);
        return false;
    }
};

export const updateEducation = async (
    educationId: string,
    educationData: Education,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("education")
            .update(educationData)
            .eq("id", educationId);

        if (error) {
            console.error("Error updating education:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error updating education:", error);
        return false;
    }
};

export const deleteEducation = async (
    educationId: string,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("education")
            .delete()
            .eq("id", educationId);

        if (error) {
            console.error("Error deleting education:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error deleting education:", error);
        return false;
    }
};
