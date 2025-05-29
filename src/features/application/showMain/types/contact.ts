export interface Contact {
    name: string;
    position?: string | null;
    email?: string | null;
    phone?: string | null;
    notes?: string | null;
    is_primary?: boolean;
    user_id: string;
}

export interface NewContact {
    name: string;
    position?: string;
    email?: string;
    phone?: string;
    notes?: string;
}
