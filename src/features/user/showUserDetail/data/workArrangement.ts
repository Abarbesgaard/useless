import supabase from "@/lib/supabase";
import { WorkArrangement } from "../types/WorkArrangement";

// Work Arrangement CRUD
export const addWorkArrangement = async (
    userId: string,
    arrangement: WorkArrangement,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("work_arrangement")
            .insert({ profile_id: userId, ...arrangement });

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
    arrangementId: string,
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

export const getWorkArrangements = async (
    userId: string,
): Promise<string[]> => {
    try {
        const { data, error } = await supabase
            .from("work_arrangement")
            .select("arrangement_type")
            .eq("profile_id", userId);

        if (error) {
            console.error("Error fetching work arrangements:", error);
            return [];
        }

        return data?.map((item) => item.arrangement_type) || [];
    } catch (error) {
        console.error("Unexpected error fetching work arrangements:", error);
        return [];
    }
};

export const updateWorkArrangements = async (
    userId: string,
    arrangements: string[],
): Promise<boolean> => {
    try {
        // Check if profile exists first
        const { data: existingProfile, error: profileCheckError } =
            await supabase
                .from("profile")
                .select("id")
                .eq("id", userId)
                .single();
        if (profileCheckError) {
            console.error(
                "Error checking profile existence:",
                profileCheckError,
            );
            return false;
        }

        // If profile doesn't exist, create it
        if (!existingProfile) {
            const { error: profileCreateError } = await supabase
                .from("profile")
                .insert({
                    id: userId,
                    updated_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (profileCreateError) {
                console.error("Error creating profile:", profileCreateError);
                return false;
            }
        }

        const { error: deleteError } = await supabase
            .from("work_arrangement")
            .delete()
            .eq("profile_id", userId);
        if (deleteError) {
            console.error(
                "Error deleting existing work arrangements:",
                deleteError,
            );
            return false;
        }

        // Insert new arrangements
        if (arrangements.length > 0) {
            const arrangementsData = arrangements.map((arrangement) => ({
                profile_id: userId,
                arrangement_type: arrangement,
            }));

            const { error: insertError } = await supabase
                .from("work_arrangement")
                .insert(arrangementsData)
                .select();

            if (insertError) {
                console.error(
                    "Error inserting work arrangements:",
                    insertError,
                );
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error("Unexpected error updating work arrangements:", error);
        return false;
    }
};
