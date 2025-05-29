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

export interface NewCompany {
    name: string;
    phone?: string;
    email?: string;
    website?: string;
    notes?: string;
}
