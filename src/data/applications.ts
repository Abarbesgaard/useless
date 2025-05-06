// src/data/applications.ts
import supabase from "@/lib/supabase"; // or wherever your client lives
import { Stage } from "../types/stages";
import { Application } from "@/types/application";

export const addApplication = async (app: Application, stages?: Stage[]) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user || !app.company || !app.position) return null;

  const newApp = {
    auth_user: user.id,
    company: app.company,
    position: app.position,
    notes: app.notes || "",
    url: app.url || "",
    date: new Date(app.date).toISOString(),
    current_stage: 0,
    is_deleted: false,
  };

  const { data: insertedApp, error: insertError } = await supabase
    .from("applications")
    .insert([newApp])
    .select()
    .single();

  if (insertError || !insertedApp) throw insertError;

  // Optional: insert stages
  if (stages && stages.length > 0) {
    const stageData = stages.map((s) => ({
      ...s,
      application_id: insertedApp.id,
    }));

    const { error: stageInsertError } = await supabase
      .from("application_stages")
      .insert(stageData);

    if (stageInsertError) throw stageInsertError;
  }

  return insertedApp;
};

export async function getApplicationsByUser(userId: string) {
  const { data: applications, error: appError } = await supabase
    .from("applications")
    .select("*")
    .eq("auth_user", userId)
    .eq("is_deleted", "false"); // Ensure we only fetch non-deleted applications

  if (appError) {
    console.error("Error fetching applications:", appError);
    return [];
  }

  const transformedData = await Promise.all(
    applications.map(async (app) => {
      const { data: stages, error: stagesError } = await supabase
        .from("application_stages")
        .select("*")
        .eq("application_id", app.id)
        .eq("is_deleted", false) // Ensure we only fetch non-deleted stages
        .order("position", { ascending: true });

      if (stagesError) {
        console.error("Error fetching stages:", stagesError);
        return null;
      }

      return {
        id: app.id,
        company: app.company,
        position: app.position,
        notes: app.notes || "",
        url: app.url || "",
        date: app.date || Date.now(),
        currentStage: app.current_stage || 0,
        stages: stages || [],
        user_id: app.auth_user,
        favorite: app.favorite || false,
      };
    }),
  );

  return transformedData.filter((app) => app !== null) || [];
}

export const updateApplication = async (app: Application) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || !app.company || !app.position) {
    console.error(
      "Error fetching user or invalid application data:",
      userError,
    );
    return null;
  }

  // Format application data for database
  const applicationUpdate = {
    company: app.company,
    position: app.position,
    notes: app.notes || "",
    url: app.url || "",
    current_stage: app.currentStage || 0,
    favorite: app.favorite,
  };

  // Update the record in Supabase
  const { data, error } = await supabase
    .from("applications")
    .update(applicationUpdate)
    .eq("id", app.id)
    .eq("auth_user", user.id)
    .eq("is_deleted", false) // Ensure we only update non-deleted applications
    .select();

  if (error) {
    console.error("Error updating application:", error);
    throw error;
  }

  return {
    ...app,
    ...(data?.[0] || {}),
  };
};

export const addStageToApplication = async (
  applicationId: string,
  stage: Stage,
) => {
  const { data, error } = await supabase.from("application_stages").insert([
    {
      application_id: applicationId,
      name: stage.name,
      icon: stage.icon,
      position: stage.position,
    },
  ]);

  if (error) {
    console.error("Error adding stage:", error);
    throw error;
  }

  return data;
};

export const deleteStage = async (stageId: string) => {
  const { error } = await supabase
    .from("application_stages")
    .delete()
    .eq("id", stageId);

  if (error) {
    console.error("Error deleting stage:", error);
    throw error;
  }
};

export const deleteApplication = async (applicationId: string) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return null;
  }

  // Update the 'is_deleted' field to true instead of deleting the application
  const { error } = await supabase
    .from("applications")
    .update({ is_deleted: true })
    .eq("id", applicationId)
    .eq("auth_user", user.id)
    .select(); // Add this to get back the updated row

  if (error) {
    console.error("Error marking application as deleted:", error);
    throw error;
  }

  // Optionally, mark related stages as deleted (if needed)
  const { error: stageError } = await supabase
    .from("application_stages")
    .update({ is_deleted: true })
    .eq("application_id", applicationId);

  if (stageError) {
    console.error("Error marking stages as deleted:", stageError);
    throw stageError;
  }

  // Return a success message or the id of the updated application
  return { success: true, applicationId };
};
