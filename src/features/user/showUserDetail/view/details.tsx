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
import { getSoftSkill } from "../data/softSkill";
import { getInterest } from "../data/interests";
import { getLanguage } from "../data/language";

// Add this import
import { getPersonalInfo } from "../data/profile";

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
  // Define a type for work experience
  type WorkExperience = {
    id: number;
    company: string;
    position: string;
    period: string;
    description: string;
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

  const [, setIsLoading] = useState(true);

  const handleEdit = (section: string) => {
    setIsEditing((prev) => ({
      ...prev,
      [section as keyof typeof isEditing]:
        !prev[section as keyof typeof isEditing],
    }));
  };
  const handleSave = async (section: string) => {
    console.log("handleSave called with section:", section);

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
        console.log("Saving personal data:", formData);

        const personalData: PersonalInfo = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
        };

        console.log("Calling updatePersonalInfo with:", personalData);

        const success = await updatePersonalInfo(user.id, personalData);

        console.log("updatePersonalInfo result:", success);

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
        console.log("Saving professional data:", formData);

        const professionalData: ProfessionalInfo = {
          currentTitle: formData.currentTitle,
          yearsExperience: formData.yearsExperience,
          salaryExpectation: formData.salaryExpectation,
          availableFrom: formData.availableFrom,
          links: {
            portfolio: formData.portfolioUrl,
            linkedin: formData.linkedinUrl,
            github: formData.githubUrl,
            cv: formData.cvUrl,
          },
        };

        console.log("Calling updateProfessionalInfo with:", professionalData);

        const success = await updateProfessionalInfo(user.id, professionalData);

        console.log("updateProfessionalInfo result:", success);

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
        console.log("Saving work experience data:", formData.workExperience);
        console.log("User ID:", user.id);

        let allSuccessful = true;
        const savedExperiences: typeof formData.workExperience = [];

        for (const experience of formData.workExperience) {
          // Skip empty experiences
          if (!experience.company || !experience.position) {
            console.log("Skipping empty experience:", experience);
            continue;
          }

          const state = experienceState[experience.id] || "new";
          console.log(
            `Processing experience ${experience.id} with state: ${state}`
          );

          try {
            if (state === "new") {
              console.log("Adding new experience:", experience);
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
                console.error("Failed to add experience:", experience);
              }
            } else if (state === "existing") {
              console.log("Updating existing experience:", experience);
              const success = await updateWorkExperience(
                experience.id.toString(),
                experience
              );
              if (success) {
                savedExperiences.push(experience);
              } else {
                allSuccessful = false;
                console.error("Failed to update experience:", experience);
              }
            }
          } catch (error) {
            console.error("Failed to save experience:", experience, error);
            allSuccessful = false;
          }
        }

        console.log("Saved experiences:", savedExperiences);

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
        console.log("Saving skills data:", {
          technicalSkills: formData.technicalSkills,
          softSkills: formData.softSkills,
          interests: formData.interests,
          languages: formData.languages,
        });

        // Save technical skills
        console.log("Saving technical skills...");
        const techSuccess = await updateTechnicalSkills(
          user.id,
          formData.technicalSkills
        );
        console.log("Technical skills result:", techSuccess);

        // Save soft skills
        console.log("Saving soft skills...");
        const softSuccess = await updateSoftSkills(
          user.id,
          formData.softSkills
        );
        console.log("Soft skills result:", softSuccess);

        // Save interests
        console.log("Saving interests...");
        const interestsSuccess = await updateInterests(
          user.id,
          formData.interests
        );
        console.log("Interests result:", interestsSuccess);

        // Save languages
        console.log("Saving languages...");
        const languagesSuccess = await updateLanguages(
          user.id,
          formData.languages
        );
        console.log("Languages result:", languagesSuccess);

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
      } else {
        console.log(`Saving ${section} data:`, formData);
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
    const newEdu = {
      id: Date.now(),
      institution: "",
      degree: "",
      period: "",
      grade: "",
    };
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  };

  const updateEducation = (id: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
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
          // Add other data calls here as needed
        ] = await Promise.all([
          getPersonalInfo(user.id), // Changed from getProfile to getPersonalInfo
          getProfessionalInfo(user.id),
          getTechnicalSkill(user.id),
          getSoftSkill(user.id),
          getInterest(user.id),
          getLanguage(user.id),
          getWorkExperiences(user.id),
          // Add other data calls here
        ]);

        console.log("Loaded data:", {
          personalInfo,
          professionalInfo,
          technicalSkills,
          softSkills,
          interests,
          languages,
          workExperiences,
        });

        // Update formData with all loaded data
        setFormData((prev) => ({
          ...prev,
          // Personal Information - data comes from PersonalInfo type
          firstName:
            personalInfo?.firstName || user?.user_metadata?.first_name || "",
          lastName:
            personalInfo?.lastName || user?.user_metadata?.last_name || "",
          email: personalInfo?.email || user?.email || "",
          phone: personalInfo?.phone || "",
          location: personalInfo?.location || "",
          bio: personalInfo?.bio || "",

          // Professional Information - data comes from ProfessionalInfo type
          currentTitle: professionalInfo?.currentTitle || "",
          yearsExperience: professionalInfo?.yearsExperience || "",
          salaryExpectation: professionalInfo?.salaryExpectation || "",
          availableFrom: professionalInfo?.availableFrom || "",
          portfolioUrl: professionalInfo?.links?.portfolio || "",
          linkedinUrl: professionalInfo?.links?.linkedin || "",
          githubUrl: professionalInfo?.links?.github || "",
          cvUrl: professionalInfo?.links?.cv || "",

          // Skills & Interests - arrays come directly from the get functions
          technicalSkills: technicalSkills || [],
          softSkills: softSkills || [],
          interests: interests || [],
          languages: languages || [],

          // Work Experience - array comes directly from getWorkExperiences
          workExperience:
            workExperiences.map((exp) => ({
              ...exp,
              description: exp.description || "",
            })) || [],

          // You can add more data loading here for education, preferences, etc.
        }));

        // Mark all loaded work experiences as existing
        if (workExperiences.length > 0) {
          const existingState: { [key: number]: "existing" } = {};
          workExperiences.forEach((exp) => {
            existingState[exp.id] = "existing";
          });
          setExperienceState(existingState);
        }

        console.log("Profile data loaded successfully");
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
              <Button onClick={handleSaveAll}>Gem Alle Ændringer</Button>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
