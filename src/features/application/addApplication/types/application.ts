import { Company } from "./company";
import { Contact } from "./contact";
import { Stage } from "./stages";

export interface NewApp {
  company: string;
  position: string;
  notes: string;
  url: string;
  date: number;
  company_id?: string | null;
  contact_id?: string | null;
}

export interface Application extends NewApp {
  id: string;
  user_id: string;
  currentStage: number;
  stages: Stage[];
  is_deleted: boolean;
  is_archived: boolean;
  favorite: boolean;
  company_id: string;
  contact_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Response type from your existing addApplication function
export type ApplicationResponse = {
  id: string;
  position: string;
  company: string;
  company_id: string | null;
  contact_id: string | null;
  current_stage: number;
  currentStage: number;
  date: string;
  favorite: boolean;
  is_archived: boolean;
  is_deleted: boolean;
  notes: string | null;
  url: string | null;
  auth_user: string;
  user_id: string;
  created_at: string;
  stages: Stage[];
  company_name?: string;
  company_phone?: string;
  company_email?: string;
  company_website?: string;
  company_notes?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  contact_position?: string;
  updated_at?: string;
  contact_details?: Contact | null;
  company_details?: Company | null;
};
