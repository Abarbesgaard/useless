import supabase from "@/lib/supabase";
import { Industry } from "../types/Industry";

// Industries CRUD
export const addIndustry = async (
    userId: string,
    industry: Industry,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("industry")
            .insert({ profile_id: userId, ...industry });

        if (error) {
            console.error("Error adding industry:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error adding industry:", error);
        return false;
    }
};

export const deleteIndustry = async (industryId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("industry")
            .delete()
            .eq("id", industryId);

        if (error) {
            console.error("Error deleting industry:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error deleting industry:", error);
        return false;
    }
};

export const getIndustries = async (userId: string): Promise<string[]> => {
    try {
        const { data, error } = await supabase
            .from("industry")
            .select("industry_name")
            .eq("profile_id", userId);

        if (error) {
            console.error("Error fetching industries:", error);
            return [];
        }

        return data?.map((item) => item.industry_name) || [];
    } catch (error) {
        console.error("Unexpected error fetching industries:", error);
        return [];
    }
};

export const updateIndustries = async (
    userId: string,
    industries: string[],
): Promise<boolean> => {
    try {
        // First ensure a profile exists - remove onConflict parameter
        const { error: profileError } = await supabase
            .from("profile")
            .upsert({
                id: userId,
                updated_at: new Date().toISOString(),
            });

        if (profileError) {
            console.error("Error creating/updating profile:", profileError);
            return false;
        }

        // Delete existing industries
        await supabase
            .from("industry")
            .delete()
            .eq("profile_id", userId);

        // Insert new industries
        if (industries.length > 0) {
            const industriesData = industries.map((industry) => ({
                profile_id: userId,
                industry_name: industry,
            }));

            const { error } = await supabase
                .from("industry")
                .insert(industriesData);

            if (error) {
                console.error("Error inserting industries:", error);
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error("Unexpected error updating industries:", error);
        return false;
    }
};
