import supabase from "@/lib/supabase";

// Interests CRUD
export const addInterest = async (
    userId: string,
    interestName: string,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("interests")
            .insert({ profile_id: userId, interest_name: interestName });

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

export const deleteInterest = async (interestId: number): Promise<boolean> => {
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
