import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Company } from "@/types/company";
import { Contact } from "@/types/contact";

interface JobApplicationFormProps {
  newApp: {
    company: string;
    position: string;
    url: string;
    notes: string;
  };
  companyInfo: {
    id: string;
    user_id: string;
    name: string;
    phone: string;
    email: string;
    website: string;
    notes?: string;
  };
  contactPerson: {
    id: string;
    user_id: string;
    name: string;
    position: string;
    email: string;
    phone: string;
    notes: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: "newApp" | "companyInfo" | "contactPerson"
  ) => void;
  onSubmit: (companyInfo: Company, contactPerson: Contact) => void;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  newApp,
  companyInfo,
  contactPerson,
  onChange,
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(companyInfo, contactPerson);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <div className="mb-6 p-4 border rounded-md ">
        <h2 className="text-xl font-bold mb-4">Job Application Form</h2>

        {/* Job Application Fields */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="block text-sm font-medium mb-1">Position</Label>
            <Input
              type="text"
              name="position"
              value={newApp.position}
              onChange={(e) => onChange(e, "newApp")}
              className="w-full p-2 border rounded-md"
              placeholder="Job title"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-1">URL</Label>
            <Input
              type="url"
              name="url"
              value={newApp.url}
              onChange={(e) => onChange(e, "newApp")}
              className="w-full p-2 border rounded-md"
              placeholder="Job posting URL"
            />
          </div>
        </div>

        <div className="mt-4">
          <Label className="block text-sm font-medium mb-1">Notes</Label>
          <Textarea
            name="notes"
            value={newApp.notes}
            onChange={(e) => onChange(e, "newApp")}
            className="w-full p-2 border rounded-md"
            placeholder="Additional notes"
          />
        </div>

        {/* Company Information Fields */}
        <div className="mt-4">
          <h3 className="text-lg font-medium">Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label className="block text-sm font-medium mb-1">
                Company Name
              </Label>
              <Input
                type="text"
                name="name"
                value={companyInfo.name}
                onChange={(e) => onChange(e, "companyInfo")}
                className="w-full p-2 border rounded-md"
                placeholder="Company name"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium mb-1">
                Company Phone
              </Label>
              <Input
                type="text"
                name="phone"
                value={companyInfo.phone}
                onChange={(e) => onChange(e, "companyInfo")}
                className="w-full p-2 border rounded-md"
                placeholder="Company phone"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium mb-1">
                Company Email
              </Label>
              <Input
                type="email"
                name="email"
                value={companyInfo.email}
                onChange={(e) => onChange(e, "companyInfo")}
                className="w-full p-2 border rounded-md"
                placeholder="Company email"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium mb-1">
                Company Website
              </Label>
              <Input
                type="url"
                name="website"
                value={companyInfo.website}
                onChange={(e) => onChange(e, "companyInfo")}
                className="w-full p-2 border rounded-md"
                placeholder="Company website"
              />
            </div>
          </div>
          <div className="mt-4">
            <Label className="block text-sm font-medium mb-1">
              Company Notes
            </Label>
            <Textarea
              name="notes"
              value={companyInfo.notes || ""}
              onChange={(e) => onChange(e, "companyInfo")}
              className="w-full p-2 border rounded-md"
              placeholder="Company notes"
            />
          </div>
        </div>

        {/* Contact Person Fields */}
        <div className="mt-4">
          <h3 className="text-lg font-medium">Contact Person</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label className="block text-sm font-medium mb-1">Name</Label>
              <Input
                type="text"
                name="name"
                value={contactPerson.name}
                onChange={(e) => onChange(e, "contactPerson")}
                className="w-full p-2 border rounded-md"
                placeholder="Contact name"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium mb-1">Position</Label>
              <Input
                type="text"
                name="position"
                value={contactPerson.position}
                onChange={(e) => onChange(e, "contactPerson")}
                className="w-full p-2 border rounded-md"
                placeholder="Contact position"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium mb-1">Email</Label>
              <Input
                type="email"
                name="email"
                value={contactPerson.email}
                onChange={(e) => onChange(e, "contactPerson")}
                className="w-full p-2 border rounded-md"
                placeholder="Contact email"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium mb-1">Phone</Label>
              <Input
                type="tel"
                name="phone"
                value={contactPerson.phone}
                onChange={(e) => onChange(e, "contactPerson")}
                className="w-full p-2 border rounded-md"
                placeholder="Contact phone"
              />
            </div>
          </div>
          <div className="mt-4">
            <Label className="block text-sm font-medium mb-1">
              Contact Notes
            </Label>
            <Textarea
              name="notes"
              value={contactPerson.notes}
              onChange={(e) => onChange(e, "contactPerson")}
              className="w-full p-2 border rounded-md"
              placeholder="Contact notes"
            />
          </div>
        </div>

        <div className="mt-6">
          <Button type="submit" variant="default" className="w-full">
            Save Application
          </Button>
        </div>
      </div>
    </form>
  );
};

export default JobApplicationForm;
