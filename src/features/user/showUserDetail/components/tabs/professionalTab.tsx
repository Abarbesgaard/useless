import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Edit, Calendar, FileText } from "lucide-react";

interface ProfessionalTabProps {
  formData: {
    currentTitle: string;
    yearsExperience: string;
    salaryExpectation: string;
    availableFrom: string;
    portfolioUrl: string;
    linkedinUrl: string;
    githubUrl: string;
    cvUrl: string;
  };
  isEditing: {
    professional: boolean;
  };
  handleInputChange: (field: string, value: string) => void;
  handleEdit: (section: string) => void;
  handleSave: (section: string) => void;
}

export default function ProfessionalTab({
  formData,
  isEditing,
  handleInputChange,
  handleEdit,
  handleSave,
}: ProfessionalTabProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Professionelle Oplysninger</h3>
          <p className="text-sm text-muted-foreground">
            Nuværende rolle og karriereoplysninger
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            isEditing.professional
              ? handleSave("professional")
              : handleEdit("professional")
          }
        >
          {isEditing.professional ? (
            <Save className="h-4 w-4" />
          ) : (
            <Edit className="h-4 w-4" />
          )}
          {isEditing.professional ? "Gem" : "Rediger"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="currentTitle">Nuværende titel</Label>
            <Input
              id="currentTitle"
              value={formData.currentTitle}
              onChange={(e) =>
                handleInputChange("currentTitle", e.target.value)
              }
              disabled={!isEditing.professional}
            />
          </div>
          <div>
            <Label htmlFor="yearsExperience">År med erfaring</Label>
            <Input
              id="yearsExperience"
              value={formData.yearsExperience}
              onChange={(e) =>
                handleInputChange("yearsExperience", e.target.value)
              }
              disabled={!isEditing.professional}
            />
          </div>
          <div>
            <Label htmlFor="salaryExpectation">Lønforventning</Label>
            <Input
              id="salaryExpectation"
              value={formData.salaryExpectation}
              onChange={(e) =>
                handleInputChange("salaryExpectation", e.target.value)
              }
              disabled={!isEditing.professional}
              placeholder="eks. 500.000 - 600.000 DKK"
            />
          </div>
          <div>
            <Label htmlFor="availableFrom">Tilgængelig fra</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="availableFrom"
                value={formData.availableFrom}
                onChange={(e) =>
                  handleInputChange("availableFrom", e.target.value)
                }
                disabled={!isEditing.professional}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Links & Dokumenter</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="portfolioUrl">Portfolio URL</Label>
              <Input
                id="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={(e) =>
                  handleInputChange("portfolioUrl", e.target.value)
                }
                disabled={!isEditing.professional}
                placeholder="https://ditportfolio.com"
              />
            </div>
            <div>
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={(e) =>
                  handleInputChange("linkedinUrl", e.target.value)
                }
                disabled={!isEditing.professional}
                placeholder="https://linkedin.com/in/ditprofil"
              />
            </div>
            <div>
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                value={formData.githubUrl}
                onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                disabled={!isEditing.professional}
                placeholder="https://github.com/ditbrugernavn"
              />
            </div>
            <div>
              <Label htmlFor="cvUrl">CV Fil</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="cvUrl"
                  value={formData.cvUrl}
                  onChange={(e) => handleInputChange("cvUrl", e.target.value)}
                  disabled={!isEditing.professional}
                />
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
