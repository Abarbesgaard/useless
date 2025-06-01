import supabase from "@/lib/supabase";

// Industries CRUD
export const addIndustry = async (
    userId: string,
    industryName: string,
): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("industries")
            .insert({ profile_id: userId, industry_name: industryName });

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

export const deleteIndustry = async (industryId: number): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("industries")
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
