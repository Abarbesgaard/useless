import supabase from "@/lib/supabase";

// Technical Skills CRUD
export const addTechnicalSkill = async (
    userId: string,
    skillName: string,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("technical_skills")
            .insert({ profile_id: userId, skill_name: skillName });

        if (error) {
            console.error("Error adding technical skill:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error adding technical skill:", error);
        return false;
    }
};

export const deleteTechnicalSkill = async (
    skillId: number,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("technical_skills")
            .delete()
            .eq("id", skillId);

        if (error) {
            console.error("Error deleting technical skill:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error deleting technical skill:", error);
        return false;
    }
};
