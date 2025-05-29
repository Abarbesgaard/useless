export interface Contact {
    id: string;
    name: string;
    position?: string | null;
    email?: string | null;
    phone?: string | null;
    notes?: string | null;
    user_id: string;
}

// For creating a new contact (without id and timestamps)
export interface NewContact {
    name: string;
    position?: string;
    email?: string;
    phone?: string;
    notes?: string;
}
