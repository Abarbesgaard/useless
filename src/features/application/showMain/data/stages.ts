import supabase from "@/lib/supabase"; // or wherever your client lives
import { Stage } from "../types/stages";
import { LucideIcon } from "lucide-react";
const getIconName = (
  icon: string | LucideIcon | { name: string } | { displayName?: string },
): string => {
  // If it's already a string, use it directly
  if (typeof icon === "string") {
    return icon;
  }

  // If it has a name property (like from a form)
  if (icon && typeof icon === "object" && "name" in icon) {
    return icon.name;
  }

  // For LucideIcons, try to extract the display name
  if (icon && typeof icon === "object" && icon.displayName) {
    return icon.displayName;
  }

  // Default fallback
  return "FileText";
};

// Create Stage
export const addStage = async (
  stage: Stage,
  applicationId: string,
  note?: string,
) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return null;
  const iconName = getIconName(stage.icon);

  const { data, error } = await supabase
    .from("application_stages")
    .insert([{
      ...stage,
      application_id: applicationId,
      icon: iconName,
      position: stage.position,
      auth_user: user.id,
      is_active: false,
      note: note || null,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete Stage (soft)
export const softDeleteStage = async (stageId: string | undefined) => {
  try {
    if (!stageId) {
      console.error("Stage ID is required for deletion.");
      return { success: false, error: "Stage ID is required." };
    }
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
