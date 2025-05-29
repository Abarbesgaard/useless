export interface Company {
    id: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    notes?: string | null;
    user_id: string;
}

export interface NewCompany {
    name: string;
    phone?: string;
    email?: string;
    website?: string;
    notes?: string;
}
