import { useNavigate } from "react-router";
import JobApplicationForm from "@/components/custom/JobApplicationForm";
import { useApplicationManagement } from "@/hooks/useApplicationManagement";

function AddApplication() {
  const navigate = useNavigate();
  const { newApp, handleInputChange, addApplication } =
    useApplicationManagement();

  const handleSubmit = async () => {
    // Check if required fields are filled
    if (!newApp.company || !newApp.position) {
      alert("Please fill in required fields (Company and Position)");
      return;
    }

    await addApplication();

    navigate("/");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <JobApplicationForm
        newApp={newApp}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default AddApplication;
