import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Edit, Plus, X, Briefcase } from "lucide-react";

interface ExperienceTabProps {
  formData: {
    workExperience: Array<{
      id: number;
      company: string;
      position: string;
      period: string;
      description: string;
    }>;
  };
  isEditing: {
    experience: boolean;
  };
  handleEdit: (section: string) => void;
  handleSave: (section: string) => void;
  addExperience: () => void;
  removeExperience: (id: number) => void;
  updateExperience: (id: number, field: string, value: string) => void;
}

export default function ExperienceTab({
  formData,
  isEditing,
  handleEdit,
  handleSave,
  addExperience,
  removeExperience,
  updateExperience,
}: ExperienceTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Arbejdserfaring</h3>
            <p className="text-sm text-muted-foreground">
              Din tidligere og nuværende arbejdserfaring
            </p>
          </div>
          <div className="flex gap-2">
            {isEditing.experience && (
              <Button variant="outline" size="sm" onClick={addExperience}>
                <Plus className="h-4 w-4" />
                Tilføj
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                isEditing.experience
                  ? handleSave("experience")
                  : handleEdit("experience")
              }
            >
              {isEditing.experience ? (
                <Save className="h-4 w-4" />
              ) : (
                <Edit className="h-4 w-4" />
              )}
              {isEditing.experience ? "Gem" : "Rediger"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.workExperience.map((exp, index) => (
            <div key={exp.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">
                    {exp.position || `Stilling ${index + 1}`}
                  </span>
                </div>
                {isEditing.experience && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(exp.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Virksomhed</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(exp.id, "company", e.target.value)
                    }
                    disabled={!isEditing.experience}
                    placeholder="Virksomhedsnavn"
                  />
                </div>
                <div>
                  <Label>Stilling</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) =>
                      updateExperience(exp.id, "position", e.target.value)
                    }
                    disabled={!isEditing.experience}
                    placeholder="Din titel"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Periode</Label>
                  <Input
                    value={exp.period}
                    onChange={(e) =>
                      updateExperience(exp.id, "period", e.target.value)
                    }
                    disabled={!isEditing.experience}
                    placeholder="eks. 2022 - Nu"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Beskrivelse</Label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(exp.id, "description", e.target.value)
                    }
                    disabled={!isEditing.experience}
                    placeholder="Beskriv dine ansvarsområder og resultater..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
          {formData.workExperience.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Ingen arbejdserfaring tilføjet endnu</p>
              {isEditing.experience && (
                <Button
                  variant="outline"
                  className="mt-3"
                  onClick={addExperience}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tilføj din første stilling
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
