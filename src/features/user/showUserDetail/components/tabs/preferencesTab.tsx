import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Save, Edit, Plus, X } from "lucide-react";

interface PreferencesTabProps {
  formData: {
    preferredRoles: string[];
    preferredCompanySize: string[];
    workArrangement: string[];
    industries: string[];
  };
  isEditing: {
    preferences: boolean;
  };
  handleEdit: (section: string) => void;
  handleSave: (section: string) => void;
  addPreference: (preferenceType: string) => void;
  removePreference: (preferenceType: string, index: number) => void;
  newPreference: string;
  setNewPreference: (value: string) => void;
}

export default function PreferencesTab({
  formData,
  isEditing,
  handleEdit,
  handleSave,
  addPreference,
  removePreference,
  newPreference,
  setNewPreference,
}: PreferencesTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Job Præferencer</h3>
            <p className="text-sm text-muted-foreground">
              Dine ønskede arbejdsforhold og karrieremål
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              isEditing.preferences
                ? handleSave("preferences")
                : handleEdit("preferences")
            }
          >
            {isEditing.preferences ? (
              <Save className="h-4 w-4" />
            ) : (
              <Edit className="h-4 w-4" />
            )}
            {isEditing.preferences ? "Gem" : "Rediger"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Ønskede Roller</h4>
            <div className="flex flex-wrap gap-2">
              {formData.preferredRoles.map((role, index) => (
                <Badge key={index} variant="default" className="px-3 py-1">
                  {role}
                  {isEditing.preferences && (
                    <button
                      onClick={() => removePreference("preferredRoles", index)}
                      className="ml-2 text-chart-4 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {isEditing.preferences && (
              <div className="flex gap-2 mt-3">
                <Input
                  placeholder="Tilføj ønsket rolle"
                  value={newPreference}
                  onChange={(e) => setNewPreference(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && addPreference("preferredRoles")
                  }
                />
                <Button
                  onClick={() => addPreference("preferredRoles")}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div>
            <h4 className="font-medium mb-3">
              Foretrukken Virksomhedsstørrelse
            </h4>
            <div className="flex flex-wrap gap-2">
              {formData.preferredCompanySize.map((size, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {size}
                  {isEditing.preferences && (
                    <button
                      onClick={() =>
                        removePreference("preferredCompanySize", index)
                      }
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {isEditing.preferences && (
              <div className="flex gap-2 mt-3">
                <Input
                  placeholder="Tilføj virksomhedsstørrelse"
                  value={newPreference}
                  onChange={(e) => setNewPreference(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && addPreference("preferredCompanySize")
                  }
                />
                <Button
                  onClick={() => addPreference("preferredCompanySize")}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div>
            <h4 className="font-medium mb-3">Arbejdsarrangement</h4>
            <div className="flex flex-wrap gap-2">
              {formData.workArrangement.map((arrangement, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  {arrangement}
                  {isEditing.preferences && (
                    <button
                      onClick={() => removePreference("workArrangement", index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {isEditing.preferences && (
              <div className="flex gap-2 mt-3">
                <Input
                  placeholder="Tilføj arbejdsarrangement"
                  value={newPreference}
                  onChange={(e) => setNewPreference(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && addPreference("workArrangement")
                  }
                />
                <Button
                  onClick={() => addPreference("workArrangement")}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div>
            <h4 className="font-medium mb-3">Interessante Brancher</h4>
            <div className="flex flex-wrap gap-2">
              {formData.industries.map((industry, index) => (
                <Badge
                  key={index}
                  variant="default"
                  className="px-3 py-1 bg-blue-100 text-blue-800"
                >
                  {industry}
                  {isEditing.preferences && (
                    <button
                      onClick={() => removePreference("industries", index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {isEditing.preferences && (
              <div className="flex gap-2 mt-3">
                <Input
                  placeholder="Tilføj interessant branche"
                  value={newPreference}
                  onChange={(e) => setNewPreference(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && addPreference("industries")
                  }
                />
                <Button onClick={() => addPreference("industries")} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">
            AI Ansøgningsassistent Indstillinger
          </h3>
          <p className="text-sm text-muted-foreground">
            Konfigurer hvordan AI'en skal hjælpe dig med ansøgninger
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">
              Personaliseret AI Hjælp
            </h4>
            <p className="text-sm text-blue-800 mb-3">
              AI'en bruger alle dine profiloplysninger til at:
            </p>
            <ul className="text-sm text-blue-800 space-y-1 ml-4">
              <li>• Skræddersy ansøgningsbreve til specifikke job</li>
              <li>• Foreslå relevante færdigheder at fremhæve</li>
              <li>• Optimere dit CV til forskellige roller</li>
              <li>• Identificere manglende kvalifikationer</li>
              <li>• Foreslå forbedringer til din profil</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium text-green-700 mb-1">
                Profil Komplethed
              </h5>
              <div className="flex items-center gap-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium">85%</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Næsten klar til AI optimering
              </p>
            </div>

            <div className="p-3 border rounded-lg">
              <h5 className="font-medium text-blue-700 mb-1">AI Tilpasning</h5>
              <div className="flex items-center gap-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "92%" }}
                  ></div>
                </div>
                <span className="text-sm font-medium">92%</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Høj kvalitet personalisering
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
