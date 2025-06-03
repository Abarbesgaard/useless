import supabase from "@/lib/supabase";
import { PreferredRole } from "../types/PreferredRole";

export const addPreferredRole = async (
    userId: string,
    role: PreferredRole,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("preferred_role")
            .insert({ profile_id: userId, ...role });

        if (error) {
            console.error("Error adding preferred role:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error adding preferred role:", error);
        return false;
    }
};

export const deletePreferredRole = async (roleId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("preferred_role")
            .delete()
            .eq("id", roleId);

        if (error) {
            console.error("Error deleting preferred role:", error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Unexpected error deleting preferred role:", error);
        return false;
    }
};

export const getPreferredRoles = async (userId: string): Promise<string[]> => {
    try {
        const { data, error } = await supabase
            .from("preferred_role")
            .select("role_name")
            .eq("profile_id", userId);

        if (error) {
            console.error("Error fetching preferred roles:", error);
            return [];
        }

        return data?.map((item) => item.role_name) || [];
    } catch (error) {
        console.error("Unexpected error fetching preferred roles:", error);
        return [];
    }
};

export const updatePreferredRoles = async (
    userId: string,
    roles: string[],
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

        // Delete existing preferred roles
        await supabase
            .from("preferred_role")
            .delete()
            .eq("profile_id", userId);

        // Insert new roles
        if (roles.length > 0) {
            const rolesData = roles.map((role) => ({
                profile_id: userId,
                role_name: role,
            }));

            const { error } = await supabase
                .from("preferred_role")
                .insert(rolesData);

            if (error) {
                console.error("Error inserting preferred roles:", error);
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error("Unexpected error updating preferred roles:", error);
        return false;
    }
};
