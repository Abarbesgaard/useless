import supabase from "@/lib/supabase"; // or wherever your client lives
import { Stage } from "@/types/stages";
// Create Stage
export const addStage = async (stage: Stage, applicationId: string) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return null;

  const { data, error } = await supabase
    .from("application_stages")
    .insert([{ ...stage, application_id: applicationId, auth_user: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update Stage
export const updateStage = async (
  stageId: string,
  updatedStage: Partial<Stage>
) => {
  const { data, error } = await supabase
    .from("application_stages")
    .update(updatedStage)
    .eq("id", stageId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete Stage (soft)
export const softDeleteStage = async (stageId: string) => {
  try {
    // Check if the stage exists before updating
    const { error: selectError } = await supabase
      .from("application_stages")
      .select("id, is_deleted")
      .eq("id", stageId)
      .single();

    if (selectError) {
      console.error("Error fetching stage:", selectError);
      return { success: false, error: selectError.message };
    }

    // Proceed with updating if the stage exists
    const { error: updateError } = await supabase
      .from("application_stages")
      .update({ is_deleted: true })
      .eq("id", stageId);

    if (updateError) {
      console.error("Error updating stage:", updateError);
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in softDeleteStage:", error);
    return { success: false };
  }
};
