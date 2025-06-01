import supabase from "@/lib/supabase";

// Soft Skills CRUD
export const addSoftSkill = async (
    userId: string,
    skillName: string,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("soft_skills")
            .insert({ profile_id: userId, skill_name: skillName });

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

export const deleteSoftSkill = async (skillId: number): Promise<boolean> => {
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
