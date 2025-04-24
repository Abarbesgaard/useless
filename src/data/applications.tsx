// src/data/applications.ts
import supabase from "@/lib/supabase"; // or wherever your client lives
import { defaultInitialStages } from "./../constants/defaultInitialStages";
import { Stage } from "../types/stages";
import { Application } from "@/types/application";

export const addApplication = async (newApp: Application, userId: string) => {
  if (!newApp.company || !newApp.position || !userId) return null;

  const application = {
    user_id: userId,
    company: newApp.company,
    position: newApp.position,
    notes: newApp.notes,
    url: newApp.url,
    date: newApp.date,
    stages: JSON.stringify(
      defaultInitialStages.map((stage: Stage) => ({
        id: stage.id,
        name: stage.name,
      }))
    ),
    current_stage: 0,
  };

  const { data, error } = await supabase
    .from("applications")
    .insert([application])
    .select();

  if (error) throw error;

  return {
    ...application,
    id: data?.[0].id,
    currentStage: application.current_stage,
    stages: defaultInitialStages,
  };
};
