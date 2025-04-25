// src/data/applications.ts
import supabase from "@/lib/supabase"; // or wherever your client lives
import { Stage } from "../types/stages";
import { Application } from "@/types/application";

export const addApplication = async (newApp: Application) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || !newApp.company || !newApp.position) return null;

  // Prepare the application object without the 'stages' field
  const application = {
    auth_user: user.id,
    company: newApp.company,
    position: newApp.position,
    notes: newApp.notes,
    url: newApp.url,
    date: new Date(newApp.date).toISOString(),
    current_stage: 0, // Keep current_stage
  };

  // Insert the application into the 'applications' table
  const { data, error } = await supabase
    .from("applications")
    .insert([application])
    .select();

  if (error) {
    console.error("Error adding application:", error);
    throw error;
  }

  // Return the inserted application data
  return {
    ...application,
    id: data?.[0].id,
    currentStage: application.current_stage,
  };
};

export async function getApplicationsByUser(userId: string) {
  const { data: applications, error: appError } = await supabase
    .from("applications")
    .select("*")
    .eq("auth_user", userId);

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
      };
    })
  );

  return transformedData.filter((app) => app !== null) || [];
}

export const updateApplication = async (app: Application) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || !app.company || !app.position) return null;

  // Format application data for database
  const applicationUpdate = {
    company: app.company,
    position: app.position,
    notes: app.notes,
    url: app.url,
    current_stage: app.currentStage,
  };

  // Update the record in Supabase
  const { data, error } = await supabase
    .from("applications")
    .update(applicationUpdate)
    .eq("id", app.id)
    .eq("auth_user", user.id)
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
  stage: Stage
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

  // Delete the application from the 'applications' table
  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("id", applicationId)
    .eq("auth_user", user.id);

  if (error) {
    console.error("Error deleting application:", error);
    throw error;
  }

  // Optionally, delete related stages for this application (if needed)
  const { error: stageError } = await supabase
    .from("application_stages")
    .delete()
    .eq("application_id", applicationId);

  if (stageError) {
    console.error("Error deleting stages:", stageError);
    throw stageError;
  }

  // Return a success message or the id of the deleted application
  return { success: true, applicationId };
};
