import supabase from "@/lib/supabase";
import { Interest } from "../types/Interest";

// Interests CRUD
export const addInterest = async (
    userId: string,
    interest: Interest,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("interest")
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
            .from("interest")
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
export const updateInterests = async (
    userId: string,
    interests: string[],
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

        // Delete existing interests
        await supabase
            .from("interest")
            .delete()
            .eq("profile_id", userId);

        // Insert new interests
        if (interests.length > 0) {
            const interestsData = interests.map((interest) => ({
                profile_id: userId,
                interest_name: interest,
            }));

            const { error } = await supabase
                .from("interest")
                .insert(interestsData);

            if (error) {
                console.error("Error inserting interests:", error);
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error("Unexpected error updating interests:", error);
        return false;
    }
};

export const getInterest = async (userId: string): Promise<string[]> => {
    try {
        const { data, error } = await supabase
            .from("interest")
            .select("interest_name")
            .eq("profile_id", userId);

        if (error) {
            console.error("Error fetching interests:", error);
            return [];
        }

        return data?.map((item) => item.interest_name) || [];
    } catch (error) {
        console.error("Unexpected error fetching interests:", error);
        return [];
    }
};
