import supabase from "@/lib/supabase";
import { Interest } from "../types/Interest";

// Interests CRUD
export const addInterest = async (
    userId: string,
    interest: Interest,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("interests")
            .insert({ profile_id: userId, ...interest });

        if (error) {
            console.error("Error adding interest:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error adding interest:", error);
        return false;
    }
};

export const deleteInterest = async (interestId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("interests")
            .delete()
            .eq("id", interestId);

        if (error) {
            console.error("Error deleting interest:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error deleting interest:", error);
        return false;
    }
};
