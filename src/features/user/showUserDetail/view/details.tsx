import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SidebarInset } from "@/components/ui/sidebar";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import Header from "../components/header";
import ProfileTabs from "../components/profileTabs";
import { updatePersonalInfo } from "../data/profile";
import { updateProfessionalInfo } from "../data/professionalInfo";
import { updateTechnicalSkills } from "../data/technicalSkill";
import { updateSoftSkills } from "../data/softSkill";
import { updateInterests } from "../data/interests";
import { updateLanguages } from "../data/language";
import {
  addWorkExperience,
  updateWorkExperience,
  getWorkExperiences,
} from "../data/workExperience";
import { getProfessionalInfo } from "../data/professionalInfo";
import { getTechnicalSkill } from "../data/technicalSkill";
import { PersonalInfo } from "../types/PersonalInfo";
import { ProfessionalInfo } from "../types/ProfessionalInfo";
import { Education } from "../types/Education";
import { WorkExperience } from "../types/WorkExperience"; // Import the actual type
import { getSoftSkill } from "../data/softSkill";
import { getInterest } from "../data/interests";
import { getLanguage } from "../data/language";
import { getPersonalInfo } from "../data/profile";
import {
  getWorkArrangements,
  updateWorkArrangements,
} from "../data/workArrangement";
import { getPreferredRoles, updatePreferredRoles } from "../data/preferredRole";
import {
  getPreferredCompanySizes,
  updatePreferredCompanySizes,
} from "../data/preferredCompanySize";
import { getIndustries, updateIndustries } from "../data/industry";
import {
  addEducation as addEducationToDB,
  updateEducation as updateEducationInDB,
} from "../data/education";
import { getEducation } from "../data/education"; // You'll need to create this function
import ShareProfileDialog from "../components/ShareProfileDialog";

export default function UserProfilePage() {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState({
    personal: false,
    professional: false,
    skills: false,
    experience: false,
    education: false,
    preferences: false,
  });
  const [newPreference, setNewPreference] = useState("");

  const addPreference = (preferenceType: string) => {
    if (
      newPreference.trim() &&
      Array.isArray(formData[preferenceType as keyof typeof formData])
    ) {
      setFormData((prev) => ({
        ...prev,
        [preferenceType]: [
          ...(prev[preferenceType as keyof typeof formData] as string[]),
          newPreference.trim(),
        ],
      }));
      setNewPreference("");
    }
  };

  const removePreference = (preferenceType: string, index: number) => {
    if (Array.isArray(formData[preferenceType as keyof typeof formData])) {
      setFormData((prev) => ({
        ...prev,
        [preferenceType]: (
          prev[preferenceType as keyof typeof formData] as string[]
        ).filter((_, i) => i !== index),
      }));
    }
  };

  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    currentTitle: string;
    yearsExperience: string;
    salaryExpectation: string;
    availableFrom: string;
    technicalSkills: string[];
    softSkills: string[];
    interests: string[];
    languages: string[];
    workExperience: WorkExperience[];
    education: Education[]; // You can define a type for education as well
    preferredRoles: string[];
    preferredCompanySize: string[];
    workArrangement: string[];
    industries: string[];
    cvUrl: string;
    portfolioUrl: string;
    linkedinUrl: string;
    githubUrl: string;
  }>({
    // Personal Information - will be loaded from database
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",

    // Professional Information - will be loaded from database
    currentTitle: "",
    yearsExperience: "",
    salaryExpectation: "",
    availableFrom: "",

    // Skills & Interests - will be loaded from database
    technicalSkills: [],
    softSkills: [],
    interests: [],
    languages: [],

    // Work Experience - will be loaded from database
    workExperience: [],

    // Education - will be loaded from database
    education: [],

    // Job Preferences - will be loaded from database
    preferredRoles: [],
    preferredCompanySize: [],
    workArrangement: [],
    industries: [],

    // CV & Documents - will be loaded from database
    cvUrl: "",
    portfolioUrl: "",
    linkedinUrl: "",
    githubUrl: "",
  });

  const [newSkill, setNewSkill] = useState("");
  const [activeTab, setActiveTab] = useState("personal");

  // Add state to track which experiences are new vs existing
  const [experienceState, setExperienceState] = useState<{
    [key: number]: "new" | "existing" | "deleted";
  }>({});

  // Add state to track which education entries are new vs existing
  const [educationState, setEducationState] = useState<{
    [key: number]: "new" | "existing" | "deleted";
  }>({});

  const [, setIsLoading] = useState(true);

  const handleEdit = (section: string) => {
    setIsEditing((prev) => ({
      ...prev,
      [section as keyof typeof isEditing]:
        !prev[section as keyof typeof isEditing],
    }));
  };
  const handleSave = async (section: string) => {
    if (!user?.id) {
      toast.error("Bruger ikke fundet");
      return;
    }

    try {
      setIsEditing((prev) => ({
        ...prev,
        [section as keyof typeof isEditing]: false,
      }));

      if (section === "personal") {
        const personalData: PersonalInfo = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
        };

        const success = await updatePersonalInfo(user.id, personalData);

        if (success) {
          toast.success("Personlige oplysninger gemt");
        } else {
          toast.error("Fejl ved gem af personlige oplysninger");
          setIsEditing((prev) => ({
            ...prev,
            [section as keyof typeof isEditing]: true,
          }));
        }
      } else if (section === "professional") {
        const professionalData: ProfessionalInfo = {
          currentTitle: formData.currentTitle,
          yearsExperience: formData.yearsExperience,
          salaryExpectation: formData.salaryExpectation,
          availableFrom: formData.availableFrom,
          links: {
            portfolio: formData.portfolioUrl || undefined,
            linkedin: formData.linkedinUrl || undefined,
            github: formData.githubUrl || undefined,
            cv: formData.cvUrl || undefined,
          },
        };

        const success = await updateProfessionalInfo(user.id, professionalData);

        if (success) {
          toast.success("Professionelle oplysninger gemt");
        } else {
          toast.error("Fejl ved gem af professionelle oplysninger");
          setIsEditing((prev) => ({
            ...prev,
            [section as keyof typeof isEditing]: true,
          }));
        }
      } else if (section === "experience") {
        let allSuccessful = true;
        const savedExperiences: typeof formData.workExperience = [];

        for (const experience of formData.workExperience) {
          // Skip empty experiences
          if (!experience.company || !experience.position) {
            continue;
          }

          const state = experienceState[experience.id] || "new";

          try {
            if (state === "new") {
              // Create a clean experience object including the required id
              const cleanExperience = {
                id: experience.id,
                company: experience.company,
                position: experience.position,
                period: experience.period,
                description: experience.description,
              };

              const success = await addWorkExperience(user.id, cleanExperience);
              if (success) {
                savedExperiences.push(experience);
              } else {
                allSuccessful = false;
              }
            } else if (state === "existing") {
              const success = await updateWorkExperience(
                experience.id.toString(),
                experience
              );
              if (success) {
                savedExperiences.push(experience);
              } else {
                allSuccessful = false;
              }
            }
          } catch (error) {
            console.error("Failed to save experience:", experience, error);
            allSuccessful = false;
          }
        }

        if (allSuccessful && savedExperiences.length > 0) {
          toast.success(`${savedExperiences.length} arbejdserfaringer gemt`);
        } else if (savedExperiences.length > 0) {
          toast.warning(
            `${savedExperiences.length} arbejdserfaringer gemt, men nogle fejlede`
          );
        } else {
          toast.error("Ingen arbejdserfaringer blev gemt");
          setIsEditing((prev) => ({
            ...prev,
            [section as keyof typeof isEditing]: true,
          }));
        }
      } else if (section === "skills") {
        const techSuccess = await updateTechnicalSkills(
          user.id,
          formData.technicalSkills
        );
        const softSuccess = await updateSoftSkills(
          user.id,
          formData.softSkills
        );
        const interestsSuccess = await updateInterests(
          user.id,
          formData.interests
        );
        const languagesSuccess = await updateLanguages(
          user.id,
          formData.languages
        );
        if (
          techSuccess &&
          softSuccess &&
          interestsSuccess &&
          languagesSuccess
        ) {
          toast.success("Færdigheder og interesser gemt");
        } else {
          toast.error("Fejl ved gem af færdigheder og interesser");
          setIsEditing((prev) => ({
            ...prev,
            [section as keyof typeof isEditing]: true,
          }));
        }
      } else if (section === "preferences") {
        const rolesSuccess = await updatePreferredRoles(
          user.id,
          formData.preferredRoles
        );
        const companySizeSuccess = await updatePreferredCompanySizes(
          user.id,
          formData.preferredCompanySize
        );
        const workArrangementSuccess = await updateWorkArrangements(
          user.id,
          formData.workArrangement
        );
        const industriesSuccess = await updateIndustries(
          user.id,
          formData.industries
        );
        if (
          rolesSuccess &&
          companySizeSuccess &&
          workArrangementSuccess &&
          industriesSuccess
        ) {
          toast.success("Jobpræferencer gemt");
        } else {
          toast.error("Fejl ved gem af jobpræferencer");
          console.error("Some preference updates failed:", {
            rolesSuccess,
            companySizeSuccess,
            workArrangementSuccess,
            industriesSuccess,
          });
          setIsEditing((prev) => ({
            ...prev,
            [section as keyof typeof isEditing]: true,
          }));
        }
      } else if (section === "education") {
        let allSuccessful = true;
        const savedEducation: typeof formData.education = [];

        for (const education of formData.education) {
          // Skip empty education entries
          if (!education.institution && !education.degree) {
            continue;
          }

          const state = educationState[education.id] || "new";

          try {
            if (state === "new") {
              const cleanEducation = {
                id: education.id,
                institution: education.institution,
                degree: education.degree,
                period: education.period,
                grade: education.grade,
              };

              const success = await addEducationToDB(user.id, cleanEducation);
              if (success) {
                savedEducation.push(education);
                // Mark as existing now that it's saved
                setEducationState((prev) => ({
                  ...prev,
                  [education.id]: "existing",
                }));
              } else {
                allSuccessful = false;
                console.error("Failed to add education:", education);
              }
            } else if (state === "existing") {
              const success = await updateEducationInDB(
                education.id.toString(),
                education
              );
              if (success) {
                savedEducation.push(education);
              } else {
                allSuccessful = false;
                console.error("Failed to update education:", education);
              }
            }
          } catch (error) {
            console.error("Failed to save education:", education, error);
            allSuccessful = false;
          }
        }

        if (allSuccessful && savedEducation.length > 0) {
          toast.success(`${savedEducation.length} uddannelser gemt`);
        } else if (savedEducation.length > 0) {
          toast.warning(
            `${savedEducation.length} uddannelser gemt, men nogle fejlede`
          );
        } else {
          toast.error("Ingen uddannelser blev gemt");
          setIsEditing((prev) => ({
            ...prev,
            [section as keyof typeof isEditing]: true,
          }));
        }
      } else {
        toast.success(`${section} oplysninger gemt`);
      }
    } catch (error) {
      console.error(`Error saving ${section}:`, error);
      toast.error(`Fejl ved gem af ${section} oplysninger`);
      setIsEditing((prev) => ({
        ...prev,
        [section as keyof typeof isEditing]: true,
      }));
    }
  };
  const handleSaveAll = async () => {
    const sectionsToSave = [
      "personal",
      "professional",
      "skills",
      "experience",
      "education",
      "preferences",
    ];
    let allSuccessful = true;
    let savedCount = 0;

    for (const section of sectionsToSave) {
      try {
        await handleSave(section);
        savedCount++;
      } catch (error) {
        console.error(`Failed to save ${section}:`, error);
        allSuccessful = false;
      }
    }

    if (allSuccessful) {
      toast.success(`Alle ${savedCount} sektioner blev gemt succesfuldt!`);
    } else {
      toast.warning(
        `${savedCount} af ${sectionsToSave.length} sektioner blev gemt. Se konsollen for fejldetaljer.`
      );
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = (skillType: string) => {
    if (
      newSkill.trim() &&
      Array.isArray(formData[skillType as keyof typeof formData])
    ) {
      setFormData((prev) => ({
        ...prev,
        [skillType]: [
          ...(prev[skillType as keyof typeof formData] as string[]),
          newSkill.trim(),
        ],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillType: string, index: number) => {
    if (Array.isArray(formData[skillType as keyof typeof formData])) {
      setFormData((prev) => ({
        ...prev,
        [skillType]: (
          prev[skillType as keyof typeof formData] as string[]
        ).filter((_, i) => i !== index),
      }));
    }
  };

  const addExperience = () => {
    const newId = Date.now();
    const newExp = {
      id: newId,
      company: "",
      position: "",
      period: "",
      description: "",
    };

    setFormData((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, newExp],
    }));

    // Mark as new
    setExperienceState((prev) => ({
      ...prev,
      [newId]: "new",
    }));
  };

  const updateExperience = (id: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((exp) => exp.id !== id),
    }));

    // If it was an existing experience, mark for deletion
    if (experienceState[id] === "existing") {
      // You'd call deleteWorkExperience here for existing records
      // deleteWorkExperience(id);
    }

    // Remove from state tracking
    setExperienceState((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const addEducation = () => {
    const newId = Date.now();
    const newEdu = {
      id: newId,
      institution: "",
      degree: "",
      period: "",
      grade: "",
    };
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));

    // Mark as new
    setEducationState((prev) => ({
      ...prev,
      [newId]: "new",
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => {
        return String(edu.id) === String(id) ? { ...edu, [field]: value } : edu;
      }),
    }));
  };

  const removeEducation = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => String(edu.id) !== id),
    }));

    // If it was an existing education, you could mark for deletion
    if (educationState[id as unknown as number] === "existing") {
      // Call deleteEducation here for existing records if needed
      // deleteEducation(id);
    }

    // Remove from state tracking
    setEducationState((prev) => {
      const newState = { ...prev };
      delete newState[id as unknown as number];
      return newState;
    });
  };

  const getInitials = () => {
    return `${formData.firstName?.[0] || ""}${formData.lastName?.[0] || ""}`;
  };

  // Load existing work experiences
  useEffect(() => {
    const loadExistingExperiences = async () => {
      if (!user?.id) return;

      try {
        const existingExperiences = await getWorkExperiences(user.id);

        if (existingExperiences.length > 0) {
          // Replace the hardcoded experiences with database ones
          setFormData((prev) => ({
            ...prev,
            workExperience: existingExperiences.map((exp) => ({
              ...exp,
              description: exp.description ?? "",
            })),
          }));

          // Mark all loaded experiences as existing
          const existingState: { [key: number]: "existing" } = {};
          existingExperiences.forEach((exp) => {
            existingState[exp.id] = "existing";
          });
          setExperienceState(existingState);
        }
      } catch (error) {
        console.error("Error loading existing experiences:", error);
      }
    };

    loadExistingExperiences();
  }, [user?.id]);

  // Replace your existing useEffect with this comprehensive one
  useEffect(() => {
    const loadAllProfileData = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      console.log("Loading all profile data for user:", user.id);

      try {
        // Load all data in parallel for better performance
        const [
          personalInfo,
          professionalInfo,
          technicalSkills,
          softSkills,
          interests,
          languages,
          workExperiences,
          education, // Add this
          workArrangements,
          preferredRoles,
          preferredCompanySizes,
          industries,
        ] = await Promise.all([
          getPersonalInfo(user.id),
          getProfessionalInfo(user.id),
          getTechnicalSkill(user.id),
          getSoftSkill(user.id),
          getInterest(user.id),
          getLanguage(user.id),
          getWorkExperiences(user.id),
          getEducation(user.id), // Add this function call
          getWorkArrangements(user.id),
          getPreferredRoles(user.id),
          getPreferredCompanySizes(user.id),
          getIndustries(user.id),
        ]);
        // Update formData with all loaded data
        setFormData((prev) => ({
          ...prev,
          // Personal Information
          firstName:
            personalInfo?.firstName || user?.user_metadata?.first_name || "",
          lastName:
            personalInfo?.lastName || user?.user_metadata?.last_name || "",
          email: personalInfo?.email || user?.email || "",
          phone: personalInfo?.phone || "",
          location: personalInfo?.location || "",
          bio: personalInfo?.bio || "",

          // Professional Information
          currentTitle: professionalInfo?.currentTitle || "",
          yearsExperience: professionalInfo?.yearsExperience || "",
          salaryExpectation: professionalInfo?.salaryExpectation || "",
          availableFrom: professionalInfo?.availableFrom || "",
          portfolioUrl: professionalInfo?.links?.portfolio || "",
          linkedinUrl: professionalInfo?.links?.linkedin || "",
          githubUrl: professionalInfo?.links?.github || "",
          cvUrl: professionalInfo?.links?.cv || "",

          // Skills & Interests
          technicalSkills: technicalSkills || [],
          softSkills: softSkills || [],
          interests: interests || [],
          languages: languages || [],

          // Work Experience
          workExperience:
            workExperiences.map((exp: WorkExperience) => ({
              ...exp,
              description: exp.description ?? "",
            })) || [],

          // Education - now loaded from database
          education: education || [],

          // Job Preferences - now loaded from database
          workArrangement: workArrangements || [],
          preferredRoles: preferredRoles || [],
          preferredCompanySize: preferredCompanySizes || [],
          industries: industries || [],
        }));

        // Mark all loaded work experiences as existing
        if (workExperiences.length > 0) {
          const existingState: { [key: number]: "existing" } = {};
          workExperiences.forEach((exp: WorkExperience) => {
            existingState[exp.id] = "existing";
          });
          setExperienceState(existingState);
        }

        // Mark all loaded education as existing
        if (education && education.length > 0) {
          const existingEducationState: { [key: number]: "existing" } = {};
          education.forEach((edu: Education) => {
            existingEducationState[edu.id] = "existing";
          });
          setEducationState(existingEducationState);
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
        toast.error("Fejl ved indlæsning af profil data");
      } finally {
        setIsLoading(false);
      }
    };

    loadAllProfileData();
  }, [
    user?.id,
    user?.email,
    user?.user_metadata?.first_name,
    user?.user_metadata?.last_name,
  ]); // Added missing dependencies

  return (
    <SidebarInset>
      <div className="p-6">
        <div className="max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Header
              user={user ?? null}
              formData={formData}
              getInitials={getInitials}
            />
          </div>

          <ProfileTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            formData={formData}
            isEditing={isEditing}
            handleInputChange={handleInputChange}
            handleEdit={handleEdit}
            handleSave={handleSave}
            addSkill={addSkill}
            removeSkill={removeSkill}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            addExperience={addExperience}
            removeExperience={removeExperience}
            updateExperience={updateExperience}
            addEducation={addEducation}
            removeEducation={removeEducation}
            updateEducation={updateEducation}
            addPreference={addPreference}
            removePreference={removePreference}
            newPreference={newPreference}
            setNewPreference={setNewPreference}
          />

          {/* Action Buttons */}
          <div className="mt-8 flex justify-between items-center p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">
              Sidst opdateret: {new Date().toLocaleDateString("da-DK")}
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Eksporter Profil</Button>
              <Button variant="outline">Se AI Forslag</Button>
              <ShareProfileDialog userId={user?.id ?? ""} formData={formData} />
              <Button onClick={handleSaveAll}>Gem Alle Ændringer</Button>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
