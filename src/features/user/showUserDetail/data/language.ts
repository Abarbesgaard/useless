import supabase from "@/lib/supabase";
import { Language } from "../types/Language";

// Languages CRUD
export const addLanguage = async (
    userId: string,
    language: Language,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("language")
            .insert({ profile_id: userId, ...language });

        if (error) {
            console.error("Error adding language:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error adding language:", error);
        return false;
    }
};

export const updateLanguages = async (
    userId: string,
    languages: string[],
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

        // Delete existing languages
        await supabase
            .from("language")
            .delete()
            .eq("profile_id", userId);

        // Insert new languages
        if (languages.length > 0) {
            const languagesData = languages.map((language) => ({
                profile_id: userId,
                language_name: language,
            }));

            const { error } = await supabase
                .from("language")
                .insert(languagesData);

            if (error) {
                console.error("Error inserting languages:", error);
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error("Unexpected error updating languages:", error);
        return false;
    }
};

export const deleteLanguage = async (languageId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("language")
            .delete()
            .eq("id", languageId);

        if (error) {
            console.error("Error deleting language:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error deleting language:", error);
        return false;
    }
};

export const getLanguage = async (userId: string): Promise<string[]> => {
    try {
        const { data, error } = await supabase
            .from("language")
            .select("language_name")
            .eq("profile_id", userId);

        if (error) {
            console.error("Error fetching languages:", error);
            return [];
        }

        return data?.map((item) => item.language_name) || [];
    } catch (error) {
        console.error("Unexpected error fetching languages:", error);
        return [];
    }
};
