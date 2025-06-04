import supabase from "@/lib/supabase";
import { Education } from "../types/Education";

export const addEducation = async (
    userId: string,
    educationData: Education,
): Promise<boolean> => {
    try {
        // Don't include the local ID when inserting
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...dataToInsert } = educationData;

        const { error } = await supabase
            .from("education")
            .insert({
                profile_id: userId,
                ...dataToInsert,
            })
            .select(); // Add select to get the inserted data back

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

export const getEducation = async (userId: string): Promise<Education[]> => {
    try {
        const { data, error } = await supabase
            .from("education")
            .select("*")
            .eq("profile_id", userId)
            .order("id", { ascending: false });

        if (error) {
            console.error("Error fetching education:", error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error("Unexpected error fetching education:", error);
        return [];
    }
};
