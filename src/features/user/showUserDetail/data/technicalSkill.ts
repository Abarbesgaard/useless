import supabase from "@/lib/supabase";
import { TechnicalSkill } from "../types/TechnicalSkill";

// Technical Skills CRUD
export const addTechnicalSkill = async (
    userId: string,
    skill: TechnicalSkill,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("technical_skill")
            .insert({ profile_id: userId, ...skill });

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
    skillId: string,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("technical_skill")
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
export const updateTechnicalSkills = async (
    userId: string,
    skills: string[],
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

        // Delete existing technical skills
        await supabase
            .from("technical_skill")
            .delete()
            .eq("profile_id", userId);

        // Insert new skills
        if (skills.length > 0) {
            const skillsData = skills.map((skill) => ({
                profile_id: userId,
                skill_name: skill,
            }));

            const { error } = await supabase
                .from("technical_skill")
                .insert(skillsData);

            if (error) {
                console.error("Error inserting technical skills:", error);
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error("Unexpected error updating technical skills:", error);
        return false;
    }
};

export const getTechnicalSkill = async (userId: string): Promise<string[]> => {
    try {
        const { data, error } = await supabase
            .from("technical_skill")
            .select("skill_name")
            .eq("profile_id", userId);

        if (error) {
            console.error("Error fetching technical skills:", error);
            return [];
        }

        return data?.map((item) => item.skill_name) || [];
    } catch (error) {
        console.error("Unexpected error fetching technical skills:", error);
        return [];
    }
};
