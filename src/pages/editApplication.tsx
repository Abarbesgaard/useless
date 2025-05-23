import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import JobApplicationForm from "@/components/custom/JobApplicationForm";
import { useApplicationManagement } from "@/hooks/useApplicationManagement";
import { Company } from "@/types/company";
import { Contact } from "@/types/contact";
import { Application, ApplicationWithDetails } from "@/types/application";
import { getApplicationWithDetails } from "@/data/applications";

function EditApplication() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    newApp,
    handleInputChange,
    updateApplication,
    addContact,
    addCompany,
    updateCompany,
    setNewApp,
    updateContact,
  } = useApplicationManagement();

  const [application, setApplication] = useState<ApplicationWithDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // State for company and contact information
  const [companyInfo, setCompanyInfo] = useState({
    id: "",
    user_id: "",
    name: "",
    phone: "",
    email: "",
    website: "",
    notes: "",
  });

  const [contactPerson, setContactPerson] = useState({
    id: "",
    user_id: "",
    name: "",
    position: "",
    email: "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    const loadApplication = async () => {
      if (!id) {
        navigate("/");
        return;
      }

      try {
        const result = await getApplicationWithDetails(id);

        if (!result || !result.application) {
          console.log("No application found, redirecting to home");
          navigate("/");
          return;
        }

        // Construct the ApplicationWithDetails object
        const appWithDetails: ApplicationWithDetails = {
          ...result.application,
          date:
            typeof result.application.date === "string"
              ? Date.parse(result.application.date)
              : result.application.date,
          company_details: result.company,
          contact_details: result.contact,
          currentStage: 0,
          // Handle null values by converting to empty string
          company_id: result.application.company_id || "",
          contact_id: result.application.contact_id || "",
          // Ensure other required string fields are not null
          notes: result.application.notes || "",
          url: result.application.url || "",
          created_at: result.application.created_at || "",
          updated_at: result.application.updated_at || "",
        };

        setApplication(appWithDetails);

        // Now use setNewApp to populate the form fields
        setNewApp({
          company: result.application.company || "",
          position: result.application.position || "",
          notes: result.application.notes || "",
          url: result.application.url || "",
          date:
            typeof result.application.date === "string"
              ? Date.parse(result.application.date)
              : result.application.date,
          company_id: result.application.company_id || "",
          contact_id: result.application.contact_id || "",
          created_at: result.application.created_at || "",
          updated_at: result.application.updated_at || "",
        });

        // Populate company information
        if (result.company) {
          setCompanyInfo({
            id: result.company.id || "",
            user_id: result.company.user_id || "",
            name: result.company.name || "",
            phone: result.company.phone || "",
            email: result.company.email || "",
            website: result.company.website || "",
            notes: result.company.notes || "",
          });
        }

        // Populate contact information
        if (result.contact) {
          setContactPerson({
            id: result.contact.id || "",
            user_id: result.contact.user_id || "",
            name: result.contact.name || "",
            position: result.contact.position || "",
            email: result.contact.email || "",
            phone: result.contact.phone || "",
            notes: result.contact.notes || "",
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to load application:", error);
        setLoading(false);
        navigate("/");
      }
    };

    loadApplication();
  }, [id]);

  // Handle changes for all form sections
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: "newApp" | "companyInfo" | "contactPerson"
  ) => {
    const { name, value } = e.target;

    if (section === "newApp") {
      handleInputChange(e);
    } else if (section === "companyInfo") {
      setCompanyInfo((prev) => ({ ...prev, [name]: value }));
    } else if (section === "contactPerson") {
      setContactPerson((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (companyData: Company, contactData: Contact) => {
    if (!application) return;

    try {
      // First, update or create the company
      let companyId =
        companyData.id ||
        (application as ApplicationWithDetails).company_details?.id ||
        application.company_id;

      // If no company ID exists, we need to create a new company
      if (!companyId || companyId === "") {
        // Clean up company data for creation - remove id and user_id fields
        const cleanCompanyData: Partial<Company> = {
          name: companyData.name,
          phone: companyData.phone || null,
          email: companyData.email || null,
          website: companyData.website || null,
          notes: companyData.notes || null,
        };

        const newCompany = await addCompany(cleanCompanyData as Company);
        companyId = newCompany.id;
      } else {
        // Clean up company data for update - keep the existing id
        const cleanCompanyData: Company = {
          ...companyData,
          id: companyId, // Use the existing company ID
          user_id:
            companyData.user_id ||
            (application as ApplicationWithDetails).company_details?.user_id ||
            "",
          phone: companyData.phone || null,
          email: companyData.email || null,
          website: companyData.website || null,
          notes: companyData.notes || null,
        };

        await updateCompany(companyId, cleanCompanyData);
      }

      // Next, update or create the contact
      let contactId =
        contactData.id ||
        (application as ApplicationWithDetails).contact_details?.id ||
        application.contact_id;

      // Only create/update contact if there's actual contact data
      if (contactData.name || contactData.email || contactData.phone) {
        if (!contactId || contactId === "") {
          // Clean up contact data for creation - remove id and user_id fields
          const cleanContactData: Partial<Contact> = {
            name: contactData.name,
            position: contactData.position,
            phone: contactData.phone || null,
            email: contactData.email || null,
            notes: contactData.notes || null,
          };

          const newContact = await addContact(cleanContactData as Contact);
          contactId = newContact.id;
        } else {
          // Clean up contact data for update - keep the existing id
          const cleanContactData: Contact = {
            ...contactData,
            id: contactId, // Use the existing contact ID
            user_id:
              contactData.user_id ||
              (application as ApplicationWithDetails).contact_details
                ?.user_id ||
              "",
            phone: contactData.phone || null,
            email: contactData.email || null,
            notes: contactData.notes || null,
          };

          await updateContact(contactId, cleanContactData);
        }
      }

      // Finally, update the application with the correct IDs
      const applicationUpdate: Application = {
        id: application.id,
        user_id: application.user_id,
        company: newApp.company || application.company,
        position: newApp.position || application.position,
        notes: newApp.notes || application.notes,
        url: newApp.url || application.url,
        date: newApp.date || application.date,
        currentStage: application.currentStage,
        stages: application.stages,
        is_deleted: application.is_deleted,
        is_archived: application.is_archived,
        favorite: application.favorite,
        company_id: companyId || application.company_id,
        contact_id: contactId || null,
        created_at: application.created_at,
        updated_at: application.updated_at,
      };

      console.log("Updating application with data:", applicationUpdate);

      await updateApplication(applicationUpdate);
      navigate("/");
    } catch (error) {
      console.error("Failed to update application:", error);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading application...</div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Application not found</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <JobApplicationForm
        newApp={newApp}
        companyInfo={companyInfo}
        contactPerson={contactPerson}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default EditApplication;
