import supabase from "@/lib/supabase";
import { Language } from "../types/Language";

// Languages CRUD
export const addLanguage = async (
    userId: string,
    language: Language,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("languages")
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

export const updateLanguage = async (
    languageId: string,
    language: Language,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("languages")
            .update(language)
            .eq("id", languageId);

        if (error) {
            console.error("Error updating language:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error updating language:", error);
        return false;
    }
};

export const deleteLanguage = async (languageId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("languages")
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
