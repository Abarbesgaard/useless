import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarInset } from "@/components/ui/sidebar";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import Header from "../components/header";
import ProfileTabs from "../components/profileTabs";

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

  const addPreference = (preferenceType: keyof typeof formData) => {
    if (newPreference.trim() && Array.isArray(formData[preferenceType])) {
      setFormData((prev) => ({
        ...prev,
        [preferenceType]: [
          ...(prev[preferenceType] as string[]),
          newPreference.trim(),
        ],
      }));
      setNewPreference("");
    }
  };

  const removePreference = (
    preferenceType: keyof typeof formData,
    index: number
  ) => {
    if (Array.isArray(formData[preferenceType])) {
      setFormData((prev) => ({
        ...prev,
        [preferenceType]: (prev[preferenceType] as string[]).filter(
          (_, i) => i !== index
        ),
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

  const handleEdit = (section: keyof typeof isEditing) => {
    setIsEditing((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSave = async (section: keyof typeof isEditing) => {
    try {
      setIsEditing((prev) => ({ ...prev, [section]: false }));
      // Here you would typically save to your backend/Supabase
      console.log(`Saving ${section} data:`, formData);
      toast.success(`${section} oplysninger gemt`);
    } catch (error) {
      console.error(`Error saving ${section}:`, error);
      toast.error(`Fejl ved gem af ${section} oplysninger`);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = (skillType: keyof typeof formData) => {
    if (newSkill.trim() && Array.isArray(formData[skillType])) {
      setFormData((prev) => ({
        ...prev,
        [skillType]: [...(prev[skillType] as string[]), newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillType: keyof typeof formData, index: number) => {
    if (Array.isArray(formData[skillType])) {
      setFormData((prev) => ({
        ...prev,
        [skillType]: (prev[skillType] as string[]).filter(
          (_, i) => i !== index
        ),
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

  return (
    <SidebarInset>
      <div className="p-6">
        <div className="max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Header user={user} formData={formData} getInitials={getInitials} />
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
              <Button>Gem Alle Ændringer</Button>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
