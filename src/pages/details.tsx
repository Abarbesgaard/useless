import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useApplicationManagement } from "@/hooks/useApplicationManagement";
import { ApplicationWithDetails } from "@/types/application";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Building2,
  Calendar,
  ExternalLink,
  Heart,
  Mail,
  Phone,
  User,
  Archive,
  Edit,
  Check,
  FileText,
  Award,
  MinusCircle,
  Clock,
  Video,
  MessageSquare,
  FileCheck,
  Briefcase,
  ClipboardCheck,
  Send,
  AlertCircle,
  Linkedin,
  Ghost,
  LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
const iconMap: Record<string, LucideIcon> = {
  Award,
  Check,
  MinusCircle,
  FileText,
  Mail,
  Phone,
  Calendar,
  User,
  Clock,
  Video,
  MessageSquare,
  FileCheck,
  Building2,
  Briefcase,
  ClipboardCheck,
  Send,
  AlertCircle,
  Linkedin,
  Ghost,
};

const resolveIcon = (iconName: string | LucideIcon): LucideIcon => {
  if (typeof iconName !== "string") {
    return iconName || FileText;
  }

  if (!iconName) {
    return FileText;
  }

  return iconMap[iconName] || FileText;
};
export default function DetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    applications,
    fetchSpecificApplication,
    toggleFavorite,
    toggleArchived,
    toggleStageCompletion,
  } = useApplicationManagement();

  const [application, setApplication] = useState<ApplicationWithDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadApplication = async () => {
      if (!id) {
        navigate("/");
        return;
      }

      setIsLoading(true);

      // First check if we already have the application in our state
      const existingApp = applications.find(
        (app) => app.id === id
      ) as ApplicationWithDetails;

      if (existingApp) {
        setApplication(existingApp);
        setIsLoading(false);
      } else {
        // Fetch the specific application if not in state
        try {
          const fetchedApp = await fetchSpecificApplication(id);
          if (fetchedApp) {
            setApplication(fetchedApp as ApplicationWithDetails);
          } else {
            toast.error("Application not found");
            navigate("/");
          }
        } catch (error) {
          console.error("Error loading application:", error);
          toast.error("Failed to load application");
          navigate("/");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadApplication();
  }, []); // Removed 'applications' dependency

  const handleToggleFavorite = async () => {
    if (application) {
      await toggleFavorite(application.id);
      setApplication((prev) =>
        prev ? { ...prev, favorite: !prev.favorite } : null
      );
    }
  };

  const handleToggleArchived = async () => {
    if (application) {
      await toggleArchived(application);
      setApplication((prev) =>
        prev ? { ...prev, is_archived: !prev.is_archived } : null
      );
    }
  };

  const handleStageToggle = async (stageIndex: number) => {
    if (application) {
      await toggleStageCompletion(application.id, stageIndex);
      // Update local state
      const newCurrentStage =
        stageIndex <= application.currentStage ? stageIndex - 1 : stageIndex;
      setApplication((prev) =>
        prev ? { ...prev, currentStage: newCurrentStage } : null
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen overflow-hidden">
        <div className="w-full h-full overflow-y-auto p-4">
          <div className="flex items-center justify-center h-full">
            <div className="text-lg">Loading application details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <SidebarInset>
        <div className="p-4">
          <div className="flex items-center justify-center h-full">
            <div className="text-lg">Application not found</div>
          </div>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <div className="">
        <div className="w-full h-full overflow-y-auto p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="cursor-pointer" />
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Applications
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleFavorite}
                className="flex items-center gap-2"
              >
                <Heart
                  className={`w-4 h-4 ${
                    application.favorite
                      ? "text-chart-5 fill-chart-5"
                      : "text-sidebar-ring"
                  }`}
                />
                <span className="hidden sm:inline">
                  {application.favorite ? "Unfavorite" : "Favorite"}
                </span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleArchived}
                className="flex items-center gap-2"
              >
                <Archive className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {application.is_archived ? "Unarchive" : "Archive"}
                </span>
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={() => navigate(`/edit-application/${application.id}`)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            </div>
          </div>

          <Separator className="mb-6" />
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Application Overview */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-chart-1" />
                    <div>
                      <CardTitle className="text-2xl">
                        {application.company_details?.name ||
                          application.company}
                      </CardTitle>
                      <p className="text-lg text-muted-foreground">
                        {application.position}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Applied on{" "}
                      {new Date(application.date).toLocaleDateString()}
                    </span>
                    {application.favorite && (
                      <Badge variant="secondary" className="ml-2">
                        <Heart className="w-3 h-3 mr-1 fill-current" />
                        Favorite
                      </Badge>
                    )}
                    {application.is_archived && (
                      <Badge variant="outline" className="ml-2">
                        <Archive className="w-3 h-3 mr-1" />
                        Archived
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {application.url && (
                    <div className="mb-4 ">
                      <a
                        href={application.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex gap-2 text-chart-1 hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Job Posting
                      </a>
                    </div>
                  )}

                  {application.notes && (
                    <div>
                      <h3 className="font-semibold mb-2">Notes</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {application.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Application Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  {application.stages && application.stages.length > 0 ? (
                    <div className="flex flex-wrap items-center">
                      {application.stages.map((stage, index) => {
                        const isActive =
                          index <= (application.currentStage || 0);
                        const StageIcon = resolveIcon(stage.icon);

                        return (
                          <div key={index} className="flex items-center mb-3">
                            <div className="relative group">
                              <button
                                onClick={() => handleStageToggle(index)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer
                                ${
                                  isActive
                                    ? "bg-chart-1"
                                    : "bg-sidebar-foreground hover:bg-primary"
                                }`}
                              >
                                <StageIcon
                                  size={24}
                                  className={
                                    isActive
                                      ? "text-foreground"
                                      : "text-sidebar-ring"
                                  }
                                />

                                {!isActive && (
                                  <div className="absolute inset-0 bg-chart-1 bg-opacity-75 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Check
                                      size={24}
                                      className="text-foreground"
                                    />
                                  </div>
                                )}
                              </button>
                              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-center w-24">
                                {stage.name}
                              </span>
                            </div>
                            {index < application.stages.length - 1 && (
                              <div
                                className={`h-0.5 w-8 ${
                                  index < (application.currentStage || 0)
                                    ? "bg-sidebar-primary"
                                    : "bg-muted-foreground"
                                } mx-1`}
                              ></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No application stages defined
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {application.contact_name ? (
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">
                          {application.contact_name}
                        </p>
                        {application.contact_position && (
                          <p className="text-sm text-muted-foreground">
                            {application.contact_position}
                          </p>
                        )}
                      </div>

                      {application.contact_email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <a
                            href={`mailto:${application.contact_email}`}
                            className="text-sm text-chart-1 hover:underline"
                          >
                            {application.contact_email}
                          </a>
                        </div>
                      )}

                      {application.contact_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <a
                            href={`tel:${application.contact_phone}`}
                            className="text-sm text-chart-1 hover:underline"
                          >
                            {application.contact_phone}
                          </a>
                        </div>
                      )}

                      {application.company_details?.notes && (
                        <div className="mt-3">
                          <Separator className="mb-2" />
                          <p className="text-sm text-muted-foreground">
                            {application.company_details.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No contact information available
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Company Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Company Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">
                        {application.company_details?.name ||
                          application.company}
                      </p>
                    </div>

                    {application.company_details?.website && (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        <a
                          href={application.company_details.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-chart-1 hover:underline"
                        >
                          Company Website
                        </a>
                      </div>
                    )}

                    {application.contact_details?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a
                          href={`mailto:${application.company_details?.email}`}
                          className="text-sm text-chart-1 hover:underline"
                        >
                          {application.company_details?.email}
                        </a>
                      </div>
                    )}

                    {application.company_details?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a
                          href={`tel:${application.company_details?.phone}`}
                          className="text-sm text-chart-1 hover:underline"
                        >
                          {application.company_details.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
