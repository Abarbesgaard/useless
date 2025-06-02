import supabase from "@/lib/supabase";
import { SoftSkill } from "../types/SoftSkill";

// Soft Skills CRUD
export const addSoftSkill = async (
    userId: string,
    skill: SoftSkill,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("soft_skills")
            .insert({ profile_id: userId, ...skill });

        if (error) {
            console.error("Error adding soft skill:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error adding soft skill:", error);
        return false;
    }
};

export const deleteSoftSkill = async (skillId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("soft_skills")
            .delete()
            .eq("id", skillId);

        if (error) {
            console.error("Error deleting soft skill:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error deleting soft skill:", error);
        return false;
    }
};
