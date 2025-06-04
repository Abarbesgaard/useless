import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Briefcase,
  Star,
  Award,
  GraduationCap,
  Target,
} from "lucide-react";
import PersonalTab from "./tabs/personalTab";
import ProfessionalTab from "./tabs/professionalTab";
import SkillsTab from "./tabs/skillsTab";
import ExperienceTab from "./tabs/experienceTab";
import EducationTab from "./tabs/educationTab";
import PreferencesTab from "./tabs/preferencesTab";

interface TabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  formData: {
    personal?: Record<string, unknown>;
    professional?: Record<string, unknown>;
    skills?: string[];
    experience?: Array<Record<string, unknown>>;
    education?: Array<Record<string, unknown>>;
    preferences?: string[];
    [key: string]: unknown;
  };
  isEditing: {
    personal: boolean;
    professional: boolean;
    skills: boolean;
    experience: boolean;
    education: boolean;
    preferences: boolean;
  };
  handleInputChange: (field: string, value: string) => void;
  handleEdit: (section: string) => void;
  handleSave: (section: string) => void;
  addSkill: (skillType: string) => void;
  removeSkill: (skillType: string, index: number) => void;
  newSkill: string;
  setNewSkill: (value: string) => void;
  addExperience: () => void;
  removeExperience: (id: number) => void;
  updateExperience: (id: number, field: string, value: string) => void;
  addEducation: () => void;
  removeEducation: (id: string) => void;
  updateEducation: (id: string, field: string, value: string) => void;
  addPreference: (preferenceType: string) => void;
  removePreference: (preferenceType: string, index: number) => void;
  newPreference: string;
  setNewPreference: (value: string) => void;
}

export default function ProfileTabs({
  activeTab,
  setActiveTab,
  formData,
  isEditing,
  handleInputChange,
  handleEdit,
  handleSave,
  addSkill,
  removeSkill,
  newSkill,
  setNewSkill,
  addExperience,
  removeExperience,
  updateExperience,
  addEducation,
  removeEducation,
  updateEducation,
  addPreference,
  removePreference,
  newPreference,
  setNewPreference,
}: TabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="personal" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Personligt
        </TabsTrigger>
        <TabsTrigger value="professional" className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          Professionelt
        </TabsTrigger>
        <TabsTrigger value="skills" className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          Færdigheder
        </TabsTrigger>
        <TabsTrigger value="experience" className="flex items-center gap-2">
          <Award className="h-4 w-4" />
          Erfaring
        </TabsTrigger>
        <TabsTrigger value="education" className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          Uddannelse
        </TabsTrigger>
        <TabsTrigger value="preferences" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Præferencer
        </TabsTrigger>
      </TabsList>

      {/* Personal Information Tab */}
      <TabsContent value="personal">
        <PersonalTab
          formData={{
            firstName:
              typeof formData.firstName === "string" ? formData.firstName : "",
            lastName:
              typeof formData.lastName === "string" ? formData.lastName : "",
            email: typeof formData.email === "string" ? formData.email : "",
            phone: typeof formData.phone === "string" ? formData.phone : "",
            location:
              typeof formData.location === "string" ? formData.location : "",
            bio: typeof formData.bio === "string" ? formData.bio : "",
          }}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          handleEdit={handleEdit}
          handleSave={handleSave}
        />
      </TabsContent>

      {/* Professional Information Tab */}
      <TabsContent value="professional">
        <ProfessionalTab
          formData={{
            currentTitle:
              typeof formData.currentTitle === "string"
                ? formData.currentTitle
                : "",
            yearsExperience:
              typeof formData.yearsExperience === "string"
                ? formData.yearsExperience
                : formData.yearsExperience !== undefined
                ? String(formData.yearsExperience)
                : "",
            salaryExpectation:
              typeof formData.salaryExpectation === "string"
                ? formData.salaryExpectation
                : "",
            availableFrom:
              typeof formData.availableFrom === "string"
                ? formData.availableFrom
                : "",
            portfolioUrl:
              typeof formData.portfolioUrl === "string"
                ? formData.portfolioUrl
                : "",
            linkedinUrl:
              typeof formData.linkedinUrl === "string"
                ? formData.linkedinUrl
                : "",
            githubUrl:
              typeof formData.githubUrl === "string" ? formData.githubUrl : "",
            cvUrl: typeof formData.cvUrl === "string" ? formData.cvUrl : "",
          }}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          handleEdit={handleEdit}
          handleSave={handleSave}
        />
      </TabsContent>

      {/* Skills Tab */}
      <TabsContent value="skills">
        <SkillsTab
          formData={{
            technicalSkills: Array.isArray(formData.technicalSkills)
              ? (formData.technicalSkills as string[])
              : [],
            softSkills: Array.isArray(formData.softSkills)
              ? (formData.softSkills as string[])
              : [],
            interests: Array.isArray(formData.interests)
              ? (formData.interests as string[])
              : [],
            languages: Array.isArray(formData.languages)
              ? (formData.languages as string[])
              : [],
          }}
          isEditing={isEditing}
          handleEdit={handleEdit}
          handleSave={handleSave}
          addSkill={addSkill}
          removeSkill={removeSkill}
          newSkill={newSkill}
          setNewSkill={setNewSkill}
        />
      </TabsContent>

      {/* Work Experience Tab */}
      <TabsContent value="experience">
        <ExperienceTab
          formData={{
            workExperience: Array.isArray(formData.workExperience)
              ? formData.workExperience.map((exp) => ({
                  id: typeof exp.id === "number" ? exp.id : 0,
                  company: typeof exp.company === "string" ? exp.company : "",
                  position:
                    typeof exp.position === "string" ? exp.position : "",
                  period: typeof exp.period === "string" ? exp.period : "",
                  description:
                    typeof exp.description === "string" ? exp.description : "",
                }))
              : [],
          }}
          isEditing={isEditing}
          handleEdit={handleEdit}
          handleSave={handleSave}
          addExperience={addExperience}
          removeExperience={removeExperience}
          updateExperience={updateExperience}
        />
      </TabsContent>

      {/* Education Tab */}
      <TabsContent value="education">
        <EducationTab
          formData={{
            education: Array.isArray(formData.education)
              ? formData.education.map((edu) => ({
                  id:
                    typeof edu.id === "string"
                      ? edu.id
                      : typeof edu.id === "number"
                      ? String(edu.id)
                      : "",
                  institution:
                    typeof edu.institution === "string" ? edu.institution : "",
                  degree: typeof edu.degree === "string" ? edu.degree : "",
                  period: typeof edu.period === "string" ? edu.period : "",
                  grade: typeof edu.grade === "string" ? edu.grade : "",
                }))
              : [],
          }}
          isEditing={isEditing}
          handleEdit={handleEdit}
          handleSave={handleSave}
          addEducation={addEducation}
          removeEducation={removeEducation}
          updateEducation={updateEducation}
        />
      </TabsContent>

      {/* Job Preferences Tab */}
      <TabsContent value="preferences">
        <PreferencesTab
          formData={{
            preferredRoles: Array.isArray(formData.preferredRoles)
              ? (formData.preferredRoles as string[])
              : [],
            preferredCompanySize: Array.isArray(formData.preferredCompanySize)
              ? (formData.preferredCompanySize as string[])
              : [],
            workArrangement: Array.isArray(formData.workArrangement)
              ? (formData.workArrangement as string[])
              : [],
            industries: Array.isArray(formData.industries)
              ? (formData.industries as string[])
              : [],
          }}
          isEditing={isEditing}
          handleEdit={handleEdit}
          handleSave={handleSave}
          addPreference={addPreference}
          removePreference={removePreference}
          newPreference={newPreference}
          setNewPreference={setNewPreference}
        />
      </TabsContent>
    </Tabs>
  );
}
