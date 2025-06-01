export type Profile = {
    id: string;
    created_at: string;
    updated_at: string;
};
export interface ComprehensiveProfile {
    id: string;
    created_at: string;
    updated_at: string;

    // Personal info (single object since it's a 1:1 relationship)
    personal_info?: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
        location?: string;
        bio?: string;
    };

    // Professional info (single object since it's a 1:1 relationship)
    professional_info?: {
        current_title?: string;
        years_experience?: string;
        salary_expectation?: string;
        available_from?: string;
        portfolio_url?: string;
        linkedin_url?: string;
        github_url?: string;
        cv_url?: string;
    };

    // Skills and arrays (1:many relationships)
    technical_skills?: Array<{ id: number; skill_name: string }>;
    soft_skills?: Array<{ id: number; skill_name: string }>;
    interests?: Array<{ id: number; interest_name: string }>;
    languages?: Array<
        { id: number; language_name: string; proficiency_level?: string }
    >;

    // Work experience
    work_experience?: Array<{
        id: number;
        company: string;
        position: string;
        period: string;
        description?: string;
    }>;

    // Education
    education?: Array<{
        id: number;
        institution: string;
        degree: string;
        period: string;
        grade?: string;
    }>;

    // Job preferences
    preferred_roles?: Array<{ id: number; role_name: string }>;
    preferred_company_size?: Array<{ id: number; company_size: string }>;
    work_arrangement?: Array<{ id: number; arrangement_type: string }>;
    industries?: Array<{ id: number; industry_name: string }>;
}
