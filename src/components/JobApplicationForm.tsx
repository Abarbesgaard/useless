// JobApplicationForm.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface JobApplicationFormProps {
  newApp: {
    company: string;
    position: string;
    url: string;
    notes: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: () => void;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  newApp,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="mb-6 p-4 border rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="block text-sm font-medium mb-1">Company</Label>
          <Input
            type="text"
            name="company"
            value={newApp.company}
            onChange={onChange}
            className="w-full p-2 border rounded-md"
            placeholder="Company name"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium mb-1">Position</Label>
          <Input
            type="text"
            name="position"
            value={newApp.position}
            onChange={onChange}
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
            onChange={onChange}
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
          onChange={onChange}
          className="w-full p-2 border rounded-md"
          placeholder="Additional notes"
        />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>You can customize stages after adding the application.</p>
      </div>
      <Button onClick={onSubmit} variant="outline">
        Save Application
      </Button>
    </div>
  );
};

export default JobApplicationForm;
