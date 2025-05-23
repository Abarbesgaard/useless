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
export interface ApplicationWithDetails extends Application {
  company_details?: Company | null;
  contact_details?: Contact | null;
  contact_name?: string | null;
  contact_position?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
}
export interface ApplicationFormData {
  application: {
    company: string;
    position: string;
    url: string;
    notes: string;
  };
  companyInfo: {
    phone: string;
    email: string;
    website: string;
    notes?: string;
  };
  contactPerson: {
    name: string;
    position: string;
    email: string;
    phone: string;
    notes: string;
  };
}

export interface ApplicationForSupabase {
  company: string;
  position: string;
  notes: string;
  url: string;
  date: string; // ISO string for Supabase
  auth_user: string; // Matches your existing field name
  company_id: string;
  contact_id?: string | null;
  current_stage: number; // Matches your existing field name
  is_deleted: boolean;
  is_archived?: boolean;
  favorite?: boolean;
}

// Response type from your existing addApplication function
export interface ApplicationResponse {
  stages: never[];
  user_id: string;
  id: string;
  company: string;
  position: string;
  notes: string;
  url: string;
  date: string;
  auth_user: string;
  company_id: string;
  contact_id?: string | null;
  current_stage: number;
  is_deleted: boolean;
  is_archived: boolean;
  favorite: boolean;
  created_at: string;
  updated_at?: string;
}
