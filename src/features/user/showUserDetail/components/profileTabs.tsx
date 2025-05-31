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
  removeEducation: (id: number) => void;
  updateEducation: (id: number, field: string, value: string) => void;
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
          formData={formData}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          handleEdit={handleEdit}
          handleSave={handleSave}
        />
      </TabsContent>

      {/* Professional Information Tab */}
      <TabsContent value="professional">
        <ProfessionalTab
          formData={formData}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          handleEdit={handleEdit}
          handleSave={handleSave}
        />
      </TabsContent>

      {/* Skills Tab */}
      <TabsContent value="skills">
        <SkillsTab
          formData={formData}
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
          formData={formData}
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
          formData={formData}
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
          formData={formData}
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
