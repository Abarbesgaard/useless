import supabase from "@/lib/supabase";
import { SoftSkill } from "../types/SoftSkill";

// Soft Skills CRUD
export const addSoftSkill = async (
    userId: string,
    skill: SoftSkill,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("soft_skill")
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
            .from("soft_skill")
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
export const updateSoftSkills = async (
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

        // Delete existing soft skills
        await supabase
            .from("soft_skill")
            .delete()
            .eq("profile_id", userId);

        // Insert new skills
        if (skills.length > 0) {
            const skillsData = skills.map((skill) => ({
                profile_id: userId,
                skill_name: skill,
            }));

            const { error } = await supabase
                .from("soft_skill")
                .insert(skillsData);

            if (error) {
                console.error("Error inserting soft skills:", error);
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error("Unexpected error updating soft skills:", error);
        return false;
    }
};

export const getSoftSkill = async (userId: string): Promise<string[]> => {
    try {
        const { data, error } = await supabase
            .from("soft_skill")
            .select("skill_name")
            .eq("profile_id", userId);

        if (error) {
            console.error("Error fetching soft skills:", error);
            return [];
        }

        return data?.map((item) => item.skill_name) || [];
    } catch (error) {
        console.error("Unexpected error fetching soft skills:", error);
        return [];
    }
};
