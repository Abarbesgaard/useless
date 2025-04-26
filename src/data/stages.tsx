import supabase from "@/lib/supabase"; // or wherever your client lives
import { Stage } from "@/types/stages";
// Create Stage
export const addStage = async (stage: Stage, applicationId: string) => {
  const { data, error } = await supabase
    .from("application_stages")
    .insert([{ ...stage, application_id: applicationId }])
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
  await supabase
    .from("application_stages")
    .update({ is_deleted: true })
    .eq("id", stageId);
  return { success: true };
};
