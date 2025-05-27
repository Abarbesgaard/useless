export interface Contact {
    id: string;
    name: string;
    position?: string | null;
    email?: string | null;
    phone?: string | null;
    notes?: string | null;
    is_primary?: boolean;
    user_id: string;
    is_deleted?: boolean;
    created_at?: string;
    updated_at?: string;
}

// For creating a new contact (without id and timestamps)
export interface NewContact {
    name: string;
    position?: string;
    email?: string;
    phone?: string;
    notes?: string;
    is_primary?: boolean;
}

// For updating a contact (all fields optional except id)
export interface ContactUpdate {
    id: string;
    name?: string;
    position?: string | null;
    email?: string | null;
    phone?: string | null;
    notes?: string | null;
    is_primary?: boolean;
}

// For database persistence (without timestamps that are auto-generated)
export type ContactForPersistence = Omit<Contact, "created_at" | "updated_at">;
