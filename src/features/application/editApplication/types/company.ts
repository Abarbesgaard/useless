import { Contact, NewContact } from "./contact";

// types/company.ts
export interface Company {
    id: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    notes?: string | null;
    user_id: string;
    is_deleted?: boolean;
    created_at?: string;
    updated_at?: string;
}

// For creating a new company (without id and timestamps)
export interface NewCompany {
    name: string;
    phone?: string;
    email?: string;
    website?: string;
    notes?: string;
}
// For updating a company (all fields optional except id)
export interface CompanyUpdate {
    id: string;
    name?: string;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    notes?: string | null;
}

// For database persistence (without timestamps that are auto-generated)
export type CompanyForPersistence = Omit<Company, "created_at" | "updated_at">;
// For API responses that include related data
export interface CompanyDetails {
    company: Company;
    contacts: Contact[];
    applications_count?: number;
}

// For form state management
export interface CompanyFormData {
    company: NewCompany;
    primaryContact?: NewContact;
}

export interface CompanyWithContacts extends Company {
    contacts?: Contact[];
}
