import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Edit, Plus, X, GraduationCap } from "lucide-react";

interface EducationTabProps {
  formData: {
    education: Array<{
      id: number;
      institution: string;
      degree: string;
      period: string;
      grade: string;
    }>;
  };
  isEditing: {
    education: boolean;
  };
  handleEdit: (section: string) => void;
  handleSave: (section: string) => void;
  addEducation: () => void;
  removeEducation: (id: number) => void;
  updateEducation: (id: number, field: string, value: string) => void;
}

export default function EducationTab({
  formData,
  isEditing,
  handleEdit,
  handleSave,
  addEducation,
  removeEducation,
  updateEducation,
}: EducationTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Uddannelse</h3>
            <p className="text-sm text-muted-foreground">
              Din uddannelsesbaggrund og kvalifikationer
            </p>
          </div>
          <div className="flex gap-2">
            {isEditing.education && (
              <Button variant="outline" size="sm" onClick={addEducation}>
                <Plus className="h-4 w-4" />
                Tilføj
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                isEditing.education
                  ? handleSave("education")
                  : handleEdit("education")
              }
            >
              {isEditing.education ? (
                <Save className="h-4 w-4" />
              ) : (
                <Edit className="h-4 w-4" />
              )}
              {isEditing.education ? "Gem" : "Rediger"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.education.map((edu, index) => (
            <div key={edu.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                  <span className="font-medium">
                    {edu.degree || `Uddannelse ${index + 1}`}
                  </span>
                </div>
                {isEditing.education && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(edu.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Institution</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) =>
                      updateEducation(edu.id, "institution", e.target.value)
                    }
                    disabled={!isEditing.education}
                    placeholder="Universitet/Skole"
                  />
                </div>
                <div>
                  <Label>Grad/Uddannelse</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(edu.id, "degree", e.target.value)
                    }
                    disabled={!isEditing.education}
                    placeholder="Kandidat, Bachelor, etc."
                  />
                </div>
                <div>
                  <Label>Periode</Label>
                  <Input
                    value={edu.period}
                    onChange={(e) =>
                      updateEducation(edu.id, "period", e.target.value)
                    }
                    disabled={!isEditing.education}
                    placeholder="eks. 2018 - 2020"
                  />
                </div>
                <div>
                  <Label>Karakter/GPA</Label>
                  <Input
                    value={edu.grade}
                    onChange={(e) =>
                      updateEducation(edu.id, "grade", e.target.value)
                    }
                    disabled={!isEditing.education}
                    placeholder="eks. 10.2"
                  />
                </div>
              </div>
            </div>
          ))}
          {formData.education.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <GraduationCap className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Ingen uddannelse tilføjet endnu</p>
              {isEditing.education && (
                <Button
                  variant="outline"
                  className="mt-3"
                  onClick={addEducation}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tilføj din første uddannelse
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
