export interface ProfessionalInfo {
    currentTitle: string;
    yearsExperience: string;
    salaryExpectation: string;
    availableFrom: string;
    links: {
        portfolio?: string;
        linkedin?: string;
        github?: string;
        cv?: string;
    } | null;
}
