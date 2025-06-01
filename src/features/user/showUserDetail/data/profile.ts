import supabase from "@/lib/supabase";
import { Profile } from "../types/profile";
/**
 * Fetches the profile of a user by their ID.
 * @param userId - The ID of the user whose profile is to be fetched.
 * @returns A Promise that resolves to the user's profile or null if not found or an error occurs.
 */
export const getProfile = async (userId: string): Promise<Profile | null> => {
    try {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) {
            console.error("Error fetching profile:", error);
            return null;
        }

        return data as Profile;
    } catch (error) {
        console.error("Unexpected error:", error);
        return null;
    }
};
