import supabase from "@/lib/supabase";
import { ComprehensiveProfile, Profile } from "../types/Profile";
import { PersonalInfo } from "../types/PersonalInfo";
import { createClient } from "@supabase/supabase-js";
import { ProfessionalInfo } from "../types/ProfessionalInfo";

/**
 * Fetches the comprehensive profile of a user by their ID, including all related data.
 * @param userId - The ID of the user whose profile is to be fetched.
 * @returns A Promise that resolves to the user's complete profile or null if not found or an error occurs.
 */
export const getProfile = async (userId: string): Promise<Profile | null> => {
    try {
        // First get the basic profile - change from "profiles" to "profile"
        const { data: profileData, error: profileError } = await supabase
            .from("profile") // Changed from "profiles" to "profile"
            .select("*")
            .eq("id", userId)
            .single();

        if (profileError || !profileData) {
            console.error("Error fetching profile:", profileError);
            return null;
        }

        // Then get all related data in parallel
        const [
            personalInfo,
            professionalInfo,
            technicalSkills,
            softSkills,
            interests,
            languages,
            workExperience,
            education,
            preferredRoles,
            preferredCompanySize,
            workArrangement,
            industries,
        ] = await Promise.all([
            supabase.from("personal_info").select("*").eq("profile_id", userId)
                .maybeSingle(), // Changed to profile_id
            supabase.from("professional_info").select("*").eq(
                "profile_id",
                userId,
            ).maybeSingle(), // Changed to profile_id
            supabase.from("technical_skills").select("*").eq(
                "profile_id",
                userId,
            ), // Changed to profile_id
            supabase.from("soft_skills").select("*").eq("profile_id", userId), // Changed to profile_id
            supabase.from("interests").select("*").eq("profile_id", userId), // Changed to profile_id
            supabase.from("languages").select("*").eq("profile_id", userId), // Changed to profile_id
            supabase.from("work_experience").select("*").eq(
                "profile_id",
                userId,
            ), // Changed to profile_id
            supabase.from("education").select("*").eq("profile_id", userId), // Changed to profile_id
            supabase.from("preferred_roles").select("*").eq(
                "profile_id",
                userId,
            ), // Changed to profile_id
            supabase.from("preferred_company_size").select("*").eq(
                "profile_id",
                userId,
            ), // Changed to profile_id
            supabase.from("work_arrangement").select("*").eq(
                "profile_id",
                userId,
            ), // Changed to profile_id
            supabase.from("industries").select("*").eq("profile_id", userId), // Changed to profile_id
        ]);

        // Combine all the data
        const completeProfile = {
            ...profileData,
            personal_info: personalInfo.data,
            professional_info: professionalInfo.data,
            technical_skills: technicalSkills.data || [],
            soft_skills: softSkills.data || [],
            interests: interests.data || [],
            languages: languages.data || [],
            work_experience: workExperience.data || [],
            education: education.data || [],
            preferred_roles: preferredRoles.data || [],
            preferred_company_size: preferredCompanySize.data || [],
            work_arrangement: workArrangement.data || [],
            industries: industries.data || [],
        };

        return completeProfile as Profile;
    } catch (error) {
        console.error("Unexpected error:", error);
        return null;
    }
};

export const updatePersonalInfo = async (
    userId: string,
    personalData: PersonalInfo,
): Promise<boolean> => {
    try {
        // First ensure a profile exists
        const { error: profileError } = await supabase
            .from("profile")
            .upsert({
                id: userId,
                user_id: userId,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: "id",
            });

        if (profileError) {
            console.error("Error creating/updating profile:", profileError);
            return false;
        }

        // Check if personal_info record exists first
        const { data: existingRecord } = await supabase
            .from("personal_info")
            .select("profile_id")
            .eq("profile_id", userId)
            .maybeSingle();

        if (existingRecord) {
            // Update existing record
            const { error } = await supabase
                .from("personal_info")
                .update({
                    first_name: personalData.firstName,
                    last_name: personalData.lastName,
                    email: personalData.email,
                    phone: personalData.phone,
                    location: personalData.location,
                    bio: personalData.bio,
                    updated_at: new Date().toISOString(),
                })
                .eq("profile_id", userId);

            if (error) {
                console.error("Error updating personal info:", error);
                return false;
            }
        } else {
            // Insert new record
            const { error } = await supabase
                .from("personal_info")
                .insert({
                    profile_id: userId,
                    first_name: personalData.firstName,
                    last_name: personalData.lastName,
                    email: personalData.email,
                    phone: personalData.phone,
                    location: personalData.location,
                    bio: personalData.bio,
                    updated_at: new Date().toISOString(),
                });

            if (error) {
                console.error("Error inserting personal info:", error);
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error("Unexpected error updating personal info:", error);
        return false;
    }
};

export const getPersonalInfo = async (
    userId: string,
): Promise<PersonalInfo | null> => {
    try {
        const { data, error } = await supabase
            .from("personal_info")
            .select("*")
            .eq("profile_id", userId)
            .single();

        if (error) {
            if (error.code === "PGRST116") { // No rows returned
                return null;
            }
            console.error("Error fetching personal info:", error);
            return null;
        }

        return {
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            email: data.email || "",
            phone: data.phone || "",
            location: data.location || "",
            bio: data.bio || "",
        };
    } catch (error) {
        console.error("Unexpected error fetching personal info:", error);
        return null;
    }
};

export async function getPublicProfile(
    userId: string,
): Promise<ComprehensiveProfile | null> {
    // Create a new Supabase client for public access
    const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
    );

    try {
        // Fetch all data in parallel using the correct table names from your schema
        const [
            personalInfoResult,
            professionalInfoResult,
            technicalSkillsResult,
            softSkillsResult,
            interestsResult,
            languagesResult,
            workExperienceResult,
            educationResult,
            preferredRolesResult,
            preferredCompanySizeResult,
            workArrangementResult,
            industriesResult,
        ] = await Promise.allSettled([
            // Personal Information
            supabase
                .from("personal_info")
                .select("*")
                .eq("profile_id", userId)
                .single(),

            // Professional Information
            supabase
                .from("professional_info")
                .select("*")
                .eq("profile_id", userId)
                .single(),

            // Technical Skills - using correct table name from schema
            supabase
                .from("technical_skill")
                .select("id, skill_name")
                .eq("profile_id", userId),

            // Soft Skills - using correct table name from schema
            supabase
                .from("soft_skill")
                .select("id, skill_name")
                .eq("profile_id", userId),

            // Interests - using correct table name from schema
            supabase
                .from("interest")
                .select("id, interest_name")
                .eq("profile_id", userId),

            // Languages - using correct table name from schema
            supabase
                .from("language")
                .select("id, language_name, proficiency_level")
                .eq("profile_id", userId),

            // Work Experience - using correct table name from schema
            supabase
                .from("work_experience")
                .select("*")
                .eq("profile_id", userId)
                .order("created_at", { ascending: false }),

            // Education - using correct table name from schema
            supabase
                .from("education")
                .select("*")
                .eq("profile_id", userId)
                .order("created_at", { ascending: false }),

            // Preferred Roles - using correct table name from schema
            supabase
                .from("preferred_role")
                .select("id, role_name")
                .eq("profile_id", userId),

            // Preferred Company Size - using correct table name from schema (singular!)
            supabase
                .from("preferred_company_size")
                .select("id, company_size")
                .eq("profile_id", userId),

            // Work Arrangement - using correct table name from schema (singular!)
            supabase
                .from("work_arrangement")
                .select("id, arrangement_type")
                .eq("profile_id", userId),

            // Industries - using correct table name from schema
            supabase
                .from("industry")
                .select("id, industry_name")
                .eq("profile_id", userId),
        ]);

        // Extract data with proper error handling and typing
        const personalInfo: PersonalInfo | undefined =
            personalInfoResult.status === "fulfilled" &&
                personalInfoResult.value.data
                ? {
                    firstName: personalInfoResult.value.data.first_name || "",
                    lastName: personalInfoResult.value.data.last_name || "",
                    email: personalInfoResult.value.data.email || "",
                    phone: personalInfoResult.value.data.phone || "",
                    location: personalInfoResult.value.data.location || "",
                    bio: personalInfoResult.value.data.bio || "",
                }
                : undefined; // Changed from null to undefined

        const professionalInfo: ProfessionalInfo | undefined =
            professionalInfoResult.status === "fulfilled" &&
                professionalInfoResult.value.data
                ? {
                    currentTitle:
                        professionalInfoResult.value.data.current_title || "",
                    yearsExperience:
                        professionalInfoResult.value.data.years_experience ||
                        "",
                    salaryExpectation:
                        professionalInfoResult.value.data.salary_expectation ||
                        "",
                    availableFrom:
                        professionalInfoResult.value.data.available_from || "",
                    links: professionalInfoResult.value.data.portfolio_url ||
                        null,
                }
                : undefined; // Changed from null to undefined

        const workExperience = workExperienceResult.status === "fulfilled" &&
                workExperienceResult.value.data
            ? workExperienceResult.value.data
            : [];

        const education =
            educationResult.status === "fulfilled" && educationResult.value.data
                ? educationResult.value.data
                : [];

        // Handle skills and preferences with proper typing based on your schema
        const technicalSkills = technicalSkillsResult.status === "fulfilled" &&
                technicalSkillsResult.value.data
            ? technicalSkillsResult.value.data.map((
                skill: { id: number; skill_name: string },
            ) => ({
                id: skill.id,
                skill_name: skill.skill_name,
            }))
            : [];

        const softSkills = softSkillsResult.status === "fulfilled" &&
                softSkillsResult.value.data
            ? softSkillsResult.value.data.map((
                skill: { id: number; skill_name: string },
            ) => ({
                id: skill.id,
                skill_name: skill.skill_name,
            }))
            : [];

        const interests =
            interestsResult.status === "fulfilled" && interestsResult.value.data
                ? interestsResult.value.data.map((
                    interest: { id: number; interest_name: string },
                ) => ({
                    id: interest.id,
                    interest_name: interest.interest_name,
                }))
                : [];

        const languages =
            languagesResult.status === "fulfilled" && languagesResult.value.data
                ? languagesResult.value.data.map((
                    language: {
                        id: number;
                        language_name: string;
                        proficiency_level?: string;
                    },
                ) => ({
                    id: language.id,
                    language_name: language.language_name,
                    proficiency_level: language.proficiency_level,
                }))
                : [];

        const preferredRoles = preferredRolesResult.status === "fulfilled" &&
                preferredRolesResult.value.data
            ? preferredRolesResult.value.data.map((
                role: { id: number; role_name: string },
            ) => ({
                id: role.id,
                role_name: role.role_name,
            }))
            : [];

        // Fixed: Keep both company_size and size_name to match PreferredCompanySize type
        const preferredCompanySizes =
            preferredCompanySizeResult.status === "fulfilled" &&
                preferredCompanySizeResult.value.data
                ? preferredCompanySizeResult.value.data.map((
                    size: { id: number; company_size: string },
                ) => ({
                    id: size.id,
                    company_size: size.company_size, // Keep original field name
                    size_name: size.company_size, // Add mapped field for display
                }))
                : [];

        // Fixed: Keep both arrangement_type and arrangement_name to match WorkArrangement type
        const workArrangements = workArrangementResult.status === "fulfilled" &&
                workArrangementResult.value.data
            ? workArrangementResult.value.data.map((
                arrangement: { id: number; arrangement_type: string },
            ) => ({
                id: arrangement.id,
                arrangement_type: arrangement.arrangement_type, // Keep original field name
                arrangement_name: arrangement.arrangement_type, // Add mapped field for display
            }))
            : [];

        const industries = industriesResult.status === "fulfilled" &&
                industriesResult.value.data
            ? industriesResult.value.data.map((
                industry: { id: number; industry_name: string },
            ) => ({
                id: industry.id,
                industry_name: industry.industry_name,
            }))
            : [];

        // Build the comprehensive profile
        const profile: ComprehensiveProfile = {
            id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            personal_info: personalInfo,
            professional_info: professionalInfo,
            technical_skills: technicalSkills,
            soft_skills: softSkills,
            interests: interests,
            languages: languages,
            work_experience: workExperience,
            education: education,
            work_arrangements: workArrangements,
            preferred_roles: preferredRoles,
            preferred_company_sizes: preferredCompanySizes,
            industries: industries,
        };

        return profile;
    } catch (error) {
        console.error("Error fetching public profile:", error);
        return null;
    }
}
