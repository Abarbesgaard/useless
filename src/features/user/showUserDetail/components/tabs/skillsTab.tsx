import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Save, Edit, Plus, X } from "lucide-react";

interface SkillsTabProps {
  formData: {
    technicalSkills: string[];
    softSkills: string[];
    interests: string[];
    languages: string[];
  };
  isEditing: {
    skills: boolean;
  };
  handleEdit: (section: string) => void;
  handleSave: (section: string) => void;
  addSkill: (skillType: string) => void;
  removeSkill: (skillType: string, index: number) => void;
  newSkill: string;
  setNewSkill: (value: string) => void;
}

export default function SkillsTab({
  formData,
  isEditing,
  handleEdit,
  handleSave,
  addSkill,
  removeSkill,
  newSkill,
  setNewSkill,
}: SkillsTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="text-left">
            <h3 className="text-lg font-semibold text-left">
              Tekniske Færdigheder
            </h3>
            <p className="text-sm text-muted-foreground text-left">
              Programmeringssprog, frameworks og teknologier
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit("skills")}
          >
            <Edit className="h-4 w-4" />
            Rediger
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.technicalSkills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-sm px-3 py-1"
              >
                {skill}
                {isEditing.skills && (
                  <button
                    onClick={() => removeSkill("technicalSkills", index)}
                    className="ml-2 text-destructive hover:text-destructive/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
          {isEditing.skills && (
            <div className="flex gap-2">
              <Input
                placeholder="Tilføj ny teknisk færdighed"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && addSkill("technicalSkills")
                }
              />
              <Button onClick={() => addSkill("technicalSkills")} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-left">
              Bløde Færdigheder
            </h3>
            <p className="text-sm text-muted-foreground text-left">
              Personlige egenskaber og sociale færdigheder
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.softSkills.map((skill, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-sm px-3 py-1"
              >
                {skill}
                {isEditing.skills && (
                  <button
                    onClick={() => removeSkill("softSkills", index)}
                    className="ml-2 text-destructive hover:text-destructive/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
          {isEditing.skills && (
            <div className="flex gap-2">
              <Input
                placeholder="Tilføj ny blød færdighed"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addSkill("softSkills")}
              />
              <Button onClick={() => addSkill("softSkills")} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-left">
              Interesser & Specialer
            </h3>
            <p className="text-sm text-muted-foreground text-left">
              Områder du interesserer dig for og ønsker at arbejde med
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.interests.map((interest, index) => (
              <Badge
                key={index}
                variant="default"
                className="text-sm px-3 py-1"
              >
                {interest}
                {isEditing.skills && (
                  <button
                    onClick={() => removeSkill("interests", index)}
                    className="ml-2 text-destructive hover:text-destructive/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
          {isEditing.skills && (
            <div className="flex gap-2">
              <Input
                placeholder="Tilføj ny interesse"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addSkill("interests")}
              />
              <Button onClick={() => addSkill("interests")} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-left">Sprog</h3>
            <p className="text-sm text-muted-foreground text-left">
              Sprog du behersker og dit niveau
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {formData.languages.map((language, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded"
              >
                <span>{language}</span>
                {isEditing.skills && (
                  <button
                    onClick={() => removeSkill("languages", index)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {isEditing.skills && (
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="eks. Fransk (Begynder)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addSkill("languages")}
              />
              <Button onClick={() => addSkill("languages")} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isEditing.skills && (
        <div className="flex justify-end">
          <Button onClick={() => handleSave("skills")}>
            <Save className="h-4 w-4 m-2" />
            Gem Ændringer
          </Button>
        </div>
      )}
    </div>
  );
}
