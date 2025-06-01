import supabase from "@/lib/supabase";

// Preferred Roles CRUD
export const addPreferredRole = async (
    userId: string,
    roleName: string,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("preferred_roles")
            .insert({ profile_id: userId, role_name: roleName });

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

export const deletePreferredRole = async (roleId: number): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("preferred_roles")
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
