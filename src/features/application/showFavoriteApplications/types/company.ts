export interface Company {
    name: string;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    notes?: string | null;
}
export interface NewCompany {
    name: string;
    phone?: string;
    email?: string;
    website?: string;
    notes?: string;
}
