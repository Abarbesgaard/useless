import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarInset } from "@/components/ui/sidebar";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import Header from "../components/header";
import ProfileTabs from "../components/profileTabs";
import { getProfile, updatePersonalInfo } from "../data/profile";
import { updateProfessionalInfo } from "../data/professionalInfo";
import { PersonalInfo } from "../types/PersonalInfo";
import { ProfessionalInfo } from "../types/ProfessionalInfo";

interface ProfileWithPersonalInfo {
  personal_info?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    location?: string;
    bio?: string;
  };
}

export default function UserProfilePage() {
  const { user } = useAuth();
  const [, setIsLoading] = useState(false);

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
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: user?.user_metadata?.first_name || "Anders",
    lastName: user?.user_metadata?.last_name || "Nielsen",
    email: user?.email || "anders.nielsen@email.com",
    phone: "+45 12 34 56 78",
    location: "København, Danmark",
    bio: "Erfaren softwareudvikler med passion for moderne webudvikling og brugeroplevelse.",

    // Professional Information
    currentTitle: "Senior Frontend Developer",
    yearsExperience: "5+",
    salaryExpectation: "500.000 - 600.000 DKK",
    availableFrom: "Straks",

    // Skills & Interests
    technicalSkills: [
      "React",
      "TypeScript",
      "Node.js",
      "Python",
      "AWS",
      "Docker",
    ],
    softSkills: ["Teamwork", "Problem Solving", "Communication", "Leadership"],
    interests: ["AI/ML", "Web3", "Cloud Computing", "UX Design"],
    languages: [
      "Dansk (Modersmål)",
      "Engelsk (Flydende)",
      "Tysk (Grundlæggende)",
    ],

    // Work Experience
    workExperience: [
      {
        id: 1,
        company: "Tech Solutions ApS",
        position: "Senior Frontend Developer",
        period: "2022 - Nu",
        description:
          "Leder af frontend-teamet, udvikling af React-applikationer og mentoring af juniorer.",
      },
      {
        id: 2,
        company: "Digital Agency",
        position: "Frontend Developer",
        period: "2020 - 2022",
        description:
          "Udvikling af responsive websites og webapplikationer for forskellige kunder.",
      },
    ],

    // Education
    education: [
      {
        id: 1,
        institution: "Danmarks Tekniske Universitet",
        degree: "Kandidat i Softwareteknologi",
        period: "2018 - 2020",
        grade: "10.2",
      },
      {
        id: 2,
        institution: "Københavns Universitet",
        degree: "Bachelor i Datalogi",
        period: "2015 - 2018",
        grade: "9.8",
      },
    ],

    // Job Preferences
    preferredRoles: ["Frontend Developer", "Full Stack Developer", "Tech Lead"],
    preferredCompanySize: ["Startup", "Mellemstor virksomhed"],
    workArrangement: ["Hybrid", "Remote"],
    industries: ["Tech", "Fintech", "E-commerce", "SaaS"],

    // CV & Documents
    cvUrl: "cv_anders_nielsen_2024.pdf",
    portfolioUrl: "https://andersnielsendev.com",
    linkedinUrl: "https://linkedin.com/in/andersnielsendev",
    githubUrl: "https://github.com/andersnielsendev",
  });

  const [newSkill, setNewSkill] = useState("");
  const [activeTab, setActiveTab] = useState("personal");

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
    const newExp = {
      id: Date.now(),
      company: "",
      position: "",
      period: "",
      description: "",
    };
    setFormData((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, newExp],
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

  /* useEffect(() => {
    const loadProfileData = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const profile = (await getProfile(
          user.id
        )) as ProfileWithPersonalInfo | null;

        if (profile?.personal_info) {
          const personalInfo = profile.personal_info;
          setFormData((prev) => ({
            ...prev,
            firstName:
              personalInfo?.first_name ||
              user?.user_metadata?.first_name ||
              "Anders",
            lastName:
              personalInfo?.last_name ||
              user?.user_metadata?.last_name ||
              "Nielsen",
            email:
              personalInfo?.email || user?.email || "anders.nielsen@email.com",
            phone: personalInfo?.phone || "+45 12 34 56 78",
            location: personalInfo?.location || "København, Danmark",
            bio:
              personalInfo?.bio ||
              "Erfaren softwareudvikler med passion for moderne webudvikling og brugeroplevelse.",
          }));
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
        toast.error("Fejl ved indlæsning af profil data");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [user]); */

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
