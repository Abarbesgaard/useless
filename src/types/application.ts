import { Stage } from "./stages";

export interface NewApp {
  company: string;
  position: string;
  notes: string;
  url: string;
  date: number;
}

export interface Application extends NewApp {
  id: string;
  user_id: string;
  currentStage: number;
  stages: Stage[];
  is_deleted: boolean;
}
