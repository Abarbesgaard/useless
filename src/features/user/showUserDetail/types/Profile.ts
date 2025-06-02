import { Education } from "./Education";
import { Interest } from "./Interest";
import { Language } from "./Language";
import { PersonalInfo } from "./PersonalInfo";
import { PreferredCompanySize } from "./PreferredCompanySize";
import { PreferredRole } from "./PreferredRole";
import { ProfessionalInfo } from "./ProfessionalInfo";
import { SoftSkill } from "./SoftSkill";
import { TechnicalSkill } from "./TechnicalSkill";
import { WorkExperience } from "./WorkExperience";
import { WorkArrangement } from "./WorkArrangement";
import { Industry } from "./Industry";

export type Profile = {
    id: string;
    created_at: string;
    updated_at: string;
};
export interface ComprehensiveProfile {
    id: string;
    created_at: string;
    updated_at: string;
    personal_info?: PersonalInfo;
    professional_info?: ProfessionalInfo;
    technical_skills?: Array<TechnicalSkill>;
    soft_skills?: Array<SoftSkill>;
    interests?: Array<Interest>;
    languages?: Array<Language>;
    work_experience?: Array<WorkExperience>;
    education?: Array<Education>;
    preferred_roles?: Array<PreferredRole>;
    preferred_company_size?: Array<PreferredCompanySize>;
    work_arrangement?: Array<WorkArrangement>;
    industries?: Array<Industry>;
}
