// src/data/applications.ts
import supabase from "@/lib/supabase"; // or wherever your client lives
import { Stage } from "../types/stages";
import { Application, ApplicationResponse } from "@/types/application";
import { Company, NewCompany } from "@/types/company";
import { Contact, NewContact } from "@/types/contact";

export const addApplication = async (
  app: Application,
  stages?: Stage[],
): Promise<ApplicationResponse | null> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || !app.company || !app.position) return null;

  const newApp = {
    auth_user: user.id,
    company: app.company,
    position: app.position,
    notes: app.notes || "",
    url: app.url || "",
    date: new Date(app.date).toISOString(),
    company_id: app.company_id || null,
    contact_id: app.contact_id || null,
    favorite: app.favorite || false,
    is_archived: app.is_archived || false,
    current_stage: 0,
    is_deleted: false,
  };

  const { data: insertedApp, error: insertError } = await supabase
    .from("applications")
    .insert([newApp])
    .select()
    .single();

  if (insertError || !insertedApp) throw insertError;

  // Optional: insert stages
  if (stages && stages.length > 0) {
    const stageData = stages.map((s) => ({
      id: crypto.randomUUID(),
      auth_user: user.id,
      application_id: insertedApp.id,
      name: s.name,
      icon: s.icon,
      position: s.position,
      is_deleted: false,
    }));

    const { error: stageInsertError } = await supabase
      .from("application_stages")
      .insert(stageData);

    if (stageInsertError) throw stageInsertError;
  }

  return insertedApp as ApplicationResponse;
};

export async function getArchivedApplicationsByUser(userId: string) {
  const { data: applications, error: appError } = await supabase
    .from("applications")
    .select("*")
    .eq("auth_user", userId)
    .eq("is_deleted", false)
    .eq("is_archived", true);

  if (appError) {
    console.error("Error fetching applications:", appError);
    return [];
  }

  const transformedData = await Promise.all(
    applications.map(async (app) => {
      const { data: stages, error: stagesError } = await supabase
        .from("application_stages")
        .select("*")
        .eq("application_id", app.id)
        .eq("is_deleted", false)
        .order("position", { ascending: true });
      if (stagesError) {
        console.error("Error fetching stages:", stagesError);
        return null;
      }

      return {
        id: app.id,
        company: app.company,
        position: app.position,
        notes: app.notes || "",
        url: app.url || "",
        date: app.date || Date.now(),
        currentStage: app.current_stage || 0,
        stages: stages || [],
        user_id: app.auth_user,
        is_deleted: app.is_deleted || false,
        favorite: app.favorite || false,
        is_archived: app.is_archived || true,
        company_id: app.company_id,
        contact_id: app.contact_id,
      };
    }),
  );

  return transformedData.filter((app) => app !== null) || [];
}
export async function getFavoriteApplicationsByUser(userId: string) {
  const { data: applications, error: appError } = await supabase
    .from("applications")
    .select("*")
    .eq("auth_user", userId)
    .eq("is_deleted", false)
    .eq("favorite", true)
    .eq("is_archived", false);

  if (appError) {
    console.error("Error fetching applications:", appError);
    return [];
  }
  const transformedData = await Promise.all(
    applications.map(async (app) => {
      const { data: stages, error: stagesError } = await supabase
        .from("application_stages")
        .select("*")
        .eq("application_id", app.id)
        .eq("is_deleted", false)
        .order("position", { ascending: true });

      if (stagesError) {
        console.error("Error fetching stages:", stagesError);
        return null;
      }

      return {
        id: app.id,

        company: app.company,
        position: app.position,
        notes: app.notes || "",
        url: app.url || "",
        date: app.date || Date.now(),
        currentStage: app.current_stage || 0,
        stages: stages || [],
        user_id: app.auth_user,
        is_deleted: app.is_deleted || false,
        favorite: app.favorite || false,
        is_archived: app.is_archived || false,
        company_id: app.company_id,
        contact_id: app.contact_id,
      };
    }),
  );

  return transformedData.filter((app) => app !== null) || [];
}

export async function getApplicationsByUser(userId: string) {
  const { data: applications, error: appError } = await supabase
    .from("applications")
    .select("*")
    .eq("auth_user", userId)
    .eq("is_deleted", false)
    .eq("is_archived", false);

  if (appError) {
    console.error("Error fetching applications:", appError);
    return [];
  }

  const transformedData = await Promise.all(
    applications.map(async (app) => {
      const { data: stages, error: stagesError } = await supabase
        .from("application_stages")
        .select("*")
        .eq("application_id", app.id)
        .eq("is_deleted", false)
        .order("position", { ascending: true });

      if (stagesError) {
        console.error("Error fetching stages:", stagesError);
        return null;
      }

      return {
        id: app.id,
        company: app.company,
        company_id: app.company_id,
        contact_id: app.contact_id,
        position: app.position,
        notes: app.notes || "",
        url: app.url || "",
        date: app.date || Date.now(),
        currentStage: app.current_stage || 0,
        stages: stages || [],
        user_id: app.auth_user,
        is_deleted: app.is_deleted || false,
        favorite: app.favorite || false,
        is_archived: app.is_archived || false,
        updated_at: app.updated_at || "",
      };
    }),
  );

  return transformedData.filter((app) => app !== null) || [];
}

export const updateApplication = async (app: Application) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || !app.company || !app.position) {
    console.error(
      "Error fetching user or invalid application data:",
      userError,
    );
    return null;
  }
  // Format application data for database
  const applicationUpdate = {
    company: app.company,
    position: app.position,
    notes: app.notes || "",
    url: app.url || "",
    current_stage: app.currentStage,
    favorite: app.favorite,
  };
  // Update the record in Supabase
  const { data, error } = await supabase
    .from("applications")
    .update(applicationUpdate)
    .eq("id", app.id)
    .eq("auth_user", user.id)
    .eq("is_deleted", false) // Ensure we only update non-deleted applications
    .select();

  if (error) {
    console.error("Error updating application:", error);
    throw error;
  }

  return {
    ...app,
    ...(data?.[0] || {}),
  };
};

export const addStageToApplication = async (
  applicationId: string,
  stage: Stage,
) => {
  const { data, error } = await supabase.from("application_stages").insert([
    {
      application_id: applicationId,
      name: stage.name,
      icon: stage.icon,
      position: stage.position,
      is_deleted: false,
    },
  ]);

  if (error) {
    console.error("Error adding stage:", error);
    throw error;
  }

  return data;
};

export const deleteStage = async (stageId: string) => {
  const { error } = await supabase
    .from("application_stages")
    .delete()
    .eq("id", stageId);

  if (error) {
    console.error("Error deleting stage:", error);
    throw error;
  }
};

export const deleteApplication = async (applicationId: string) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return null;
  }

  // Update the 'is_deleted' field to true instead of deleting the application
  const { error } = await supabase
    .from("applications")
    .update({ is_deleted: true })
    .eq("id", applicationId)
    .eq("auth_user", user.id)
    .select(); // Add this to get back the updated row

  if (error) {
    console.error("Error marking application as deleted:", error);
    throw error;
  }

  // Optionally, mark related stages as deleted (if needed)
  const { error: stageError } = await supabase
    .from("application_stages")
    .update({ is_deleted: true })
    .eq("application_id", applicationId);

  if (stageError) {
    console.error("Error marking stages as deleted:", stageError);
    throw stageError;
  }

  // Return a success message or the id of the updated application
  return { success: true, applicationId };
};

export const updateArchiveStatus = async (app: Application) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || !app.company || !app.position) {
    console.error(
      "Error fetching user or invalid application data:",
      userError,
    );
    return null;
  }

  // Format application data for database
  const applicationUpdate = {
    company: app.company,
    position: app.position,
    notes: app.notes || "",
    url: app.url || "",
    current_stage: app.currentStage || 0,
    favorite: app.favorite,
    is_archived: !app.is_archived, // Toggle the archive status
  };

  const { data, error } = await supabase
    .from("applications")
    .update(applicationUpdate)
    .eq("id", app.id)
    .eq("auth_user", user.id)
    .eq("is_archived", app.is_archived)
    .select();

  if (error) {
    console.error("Error updating application:", error);
    throw error;
  }

  return {
    ...app,
    ...(data?.[0] || {}),
  };
};
export const addApplicationWithCompanyAndContact = async ({
  applicationData,
  companyData,
  contactData,
  stages,
}: {
  applicationData: Omit<
    Application,
    "id" | "user_id" | "company_id" | "contact_id" | "stages"
  >;
  companyData: NewCompany;
  contactData?: NewContact;
  stages?: Stage[];
}): Promise<ApplicationResponse | null> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  try {
    // 1. Create or get company
    let companyId: string | null = null;

    // Check if company already exists
    const { data: existingCompany, error: companyFetchError } = await supabase
      .from("companies")
      .select("id")
      .eq("name", companyData.name)
      .eq("user_id", user.id)
      .eq("is_deleted", false)
      .maybeSingle();
    if (companyFetchError) {
      console.error("Error fetching company:", companyFetchError);
    }
    if (existingCompany) {
      companyId = existingCompany.id;

      // Update existing company with new info
      const { error: updateError } = await supabase
        .from("companies")
        .update({
          phone: companyData.phone || null,
          email: companyData.email || null,
          website: companyData.website || null,
          notes: companyData.notes || null,
        })
        .eq("id", companyId);

      if (updateError) throw updateError;
    } else {
      // Create new company
      const { data: newCompany, error: companyError } = await supabase
        .from("companies")
        .insert([{
          name: companyData.name,
          phone: companyData.phone || null,
          email: companyData.email || null,
          website: companyData.website || null,
          notes: companyData.notes || null,
          user_id: user.id,
          is_deleted: false,
        }])
        .select("id")
        .single();

      if (companyError || !newCompany) throw companyError;
      companyId = newCompany.id;
    }

    // Ensure companyId is set before proceeding
    if (!companyId) {
      throw new Error("Company ID is required to create an application.");
    }

    // 2. Create contact if provided
    let contactId: string | null = null;

    if (contactData && contactData.name) {
      const { data: newContact, error: contactError } = await supabase
        .from("contacts")
        .insert([{
          ...contactData,
          user_id: user.id,
          is_deleted: false,
        }])
        .select("id")
        .single();

      if (contactError) throw contactError;
      contactId = newContact?.id || null;
    }

    // 3. Create application with relationships
    const applicationWithIds = {
      auth_user: user.id,
      company: applicationData.company,
      position: applicationData.position,
      notes: applicationData.notes || "",
      url: applicationData.url || "",
      date: new Date(applicationData.date).toISOString(),
      company_id: companyId,
      contact_id: contactId,
      favorite: applicationData.favorite || false,
      is_archived: applicationData.is_archived || false,
      current_stage: 0,
      is_deleted: false,
    };
    // Insert application directly instead of creating Application object first
    const { data: insertedApp, error: insertError } = await supabase
      .from("applications")
      .insert([applicationWithIds])
      .select()
      .single();

    if (insertError || !insertedApp) throw insertError;

    // Optional: insert stages
    if (stages && stages.length > 0) {
      const stageData = stages.map((s) => ({
        ...s,
        application_id: insertedApp.id,
        is_deleted: false,
      }));

      const { error: stageInsertError } = await supabase
        .from("application_stages")
        .insert(stageData);

      if (stageInsertError) throw stageInsertError;
    }

    return insertedApp as ApplicationResponse;
  } catch (error) {
    console.error("Error adding application with company and contact:", error);
    throw error;
  }
};
export const getApplicationWithDetails = async (
  applicationId: string,
): Promise<
  {
    application: ApplicationResponse;
    company: Company | null;
    contact: Contact | null;
  } | null
> => {
  try {
    // Get application
    const { data: application, error: appError } = await supabase
      .from("applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (appError || !application) return null;

    // Get company details
    let company: Company | null = null;
    if (application.company_id) {
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("*")
        .eq("id", application.company_id)
        .single();

      if (!companyError && companyData) {
        company = companyData as Company;
      }
    }

    // Get contact details
    let contact: Contact | null = null;
    if (application.contact_id) {
      const { data: contactData, error: contactError } = await supabase
        .from("contacts")
        .select("*")
        .eq("id", application.contact_id)
        .single();

      if (!contactError && contactData) {
        contact = contactData as Contact;
      }
    }

    return {
      application: application as ApplicationResponse,
      company,
      contact,
    };
  } catch (error) {
    console.error("Error getting application details:", error);
    return null;
  }
};

// Get all applications with company names (for list views)
// Get all applications with company names (for list views)
export const getApplicationsWithCompanies = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: applications, error } = await supabase
      .from("applications")
      .select(`
        id,
        position,
        company,
        company_id,
        contact_id,
        current_stage,
        date,
        favorite,
        is_archived,
        is_deleted,
        notes,
        url,
        auth_user,
        companies(name),
        contacts(name, phone, email, position)
      `)
      .eq("auth_user", user.id)
      .eq("is_deleted", false)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching applications with companies:", error);
      return [];
    }

    // Transform data and fetch stages for each application
    const transformedData = await Promise.all(
      applications.map(async (app) => {
        // Fetch stages for this application
        const { data: stages, error: stagesError } = await supabase
          .from("application_stages")
          .select("*")
          .eq("application_id", app.id)
          .eq("is_deleted", false)
          .order("position", { ascending: true });

        if (stagesError) {
          console.error("Error fetching stages:", stagesError);
          return null;
        }

        return {
          id: app.id,
          position: app.position,
          company: app.company,
          company_name: (Array.isArray(app.companies)
            ? app.companies[0]?.name
            : (app.companies as { name: string } | undefined)?.name) ||
            app.company,
          company_id: app.company_id,
          contact_id: app.contact_id,
          contact_name: (Array.isArray(app.contacts)
            ? app.contacts[0]?.name
            : (app.contacts as {
              name: string;
              phone?: string;
              email?: string;
              position?: string;
            } | undefined)?.name),
          contact_phone: (Array.isArray(app.contacts)
            ? app.contacts[0]?.phone
            : (app.contacts as {
              name: string;
              phone?: string;
              email?: string;
              position?: string;
            } | undefined)?.phone),
          contact_email: (Array.isArray(app.contacts)
            ? app.contacts[0]?.email
            : (app.contacts as {
              name: string;
              phone?: string;
              email?: string;
              position?: string;
            } | undefined)?.email),
          contact_position: (Array.isArray(app.contacts)
            ? app.contacts[0]?.position
            : (app.contacts as {
              name: string;
              phone?: string;
              email?: string;
              position?: string;
            } | undefined)?.position),
          current_stage: app.current_stage,
          currentStage: app.current_stage || 0,
          date: app.date,
          favorite: app.favorite,
          is_archived: app.is_archived,
          is_deleted: app.is_deleted,
          notes: app.notes || "",
          url: app.url || "",
          stages: stages || [],
          user_id: app.auth_user,
        };
      }),
    );

    return transformedData.filter((app) => app !== null) || [];
  } catch (error) {
    console.error("Error fetching applications with companies:", error);
    return [];
  }
};

export const getApplicationById = async (
  id: string,
): Promise<ApplicationResponse | null> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Error fetching user:", userError);
      return null;
    }

    // Fetch application with company and contact data
    const { data: application, error } = await supabase
      .from("applications")
      .select(`
      id,
      position,
      company,
      company_id,
      contact_id,
      current_stage,
      date,
      favorite,
      is_archived,
      is_deleted,
      notes,
      url,
      auth_user,
      created_at,
      companies(id, name, phone, email, website, notes),
      contacts(id, name, phone, email, position)
    `)
      .eq("id", id)
      .eq("auth_user", user.id)
      .single();

    if (error || !application) {
      console.error("Error fetching application by ID:", error);
      return null;
    }

    // Fetch stages for this application
    const { data: stages, error: stagesError } = await supabase
      .from("application_stages")
      .select("*")
      .eq("application_id", id)
      .eq("is_deleted", false)
      .order("position", { ascending: true });

    if (stagesError) {
      console.error("Error fetching stages:", stagesError);
    }

    // Transform the data to match your expected format
    return {
      id: application.id,
      position: application.position,
      company: application.company,
      company_id: application.company_id,
      contact_id: application.contact_id,
      current_stage: application.current_stage,
      currentStage: application.current_stage || 0,
      date: application.date,
      favorite: application.favorite,
      is_archived: application.is_archived,
      is_deleted: application.is_deleted,
      notes: application.notes || "",
      url: application.url || "",
      auth_user: application.auth_user,
      user_id: application.auth_user,
      created_at: application.created_at,
      stages: (stages || []) as Stage[],
      company_name: application.companies?.[0]?.name || application.company,
      company_phone: application.companies?.[0]?.phone,
      company_email: application.companies?.[0]?.email,
      company_website: application.companies?.[0]?.website,
      company_notes: application.companies?.[0]?.notes,
      contact_name: application.contacts?.[0]?.name,
      contact_phone: application.contacts?.[0]?.phone,
      contact_email: application.contacts?.[0]?.email,
      contact_position: application.contacts?.[0]?.position,
    } as ApplicationResponse;
  } catch (error) {
    console.error("Error in getApplicationById:", error);
    return null;
  }
};

export const addCompanyApi = async (company: Company) => {
  const { data, error } = await supabase
    .from("companies")
    .insert([company])
    .select()
    .single();

  if (error) {
    console.error("Error adding company:", error);
    throw error;
  }

  return data;
};

/**
 * Updates an existing company in the database.
 */
export const updateCompanyApi = async (companyId: string, company: Company) => {
  const { data, error } = await supabase
    .from("companies")
    .update(company)
    .eq("id", companyId)
    .select()
    .single();

  if (error) {
    console.error("Error updating company:", error);
    throw error;
  }

  return data;
};

/**
 * Adds a new contact to the database.
 */
export const addContactApi = async (contact: Contact) => {
  const { data, error } = await supabase
    .from("contacts")
    .insert([contact])
    .select()
    .single();

  if (error) {
    console.error("Error adding contact:", error);
    throw error;
  }

  return data;
};

/**
 * Updates an existing contact in the database.
 */
export const updateContactApi = async (contactId: string, contact: Contact) => {
  const { data, error } = await supabase
    .from("contacts")
    .update(contact)
    .eq("id", contactId)
    .select()
    .single();

  if (error) {
    console.error("Error updating contact:", error);
    throw error;
  }

  return data;
};
