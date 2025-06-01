import supabase from "@/lib/supabase";

// Work Arrangement CRUD
export const addWorkArrangement = async (
    userId: string,
    arrangementType: string,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("work_arrangement")
            .insert({ profile_id: userId, arrangement_type: arrangementType });

        if (error) {
            console.error("Error adding work arrangement:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error adding work arrangement:", error);
        return false;
    }
};

export const deleteWorkArrangement = async (
    arrangementId: number,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("work_arrangement")
            .delete()
            .eq("id", arrangementId);

        if (error) {
            console.error("Error deleting work arrangement:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error deleting work arrangement:", error);
        return false;
    }
};
