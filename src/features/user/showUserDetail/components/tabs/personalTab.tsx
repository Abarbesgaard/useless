import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Edit, Mail, Phone, MapPin } from "lucide-react";

interface PersonalTabProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
  };
  isEditing: {
    personal: boolean;
  };
  handleInputChange: (field: string, value: string) => void;
  handleEdit: (section: string) => void;
  handleSave: (section: string) => void;
}

export default function PersonalTab({
  formData,
  isEditing,
  handleInputChange,
  handleEdit,
  handleSave,
}: PersonalTabProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Personlige Oplysninger</h3>
          <p className="text-sm text-muted-foreground">
            Grundlæggende kontaktoplysninger og profil
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            isEditing.personal ? handleSave("personal") : handleEdit("personal")
          }
        >
          {isEditing.personal ? (
            <Save className="h-4 w-4" />
          ) : (
            <Edit className="h-4 w-4" />
          )}
          {isEditing.personal ? "Gem" : "Rediger"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Fornavn</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              disabled={!isEditing.personal}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Efternavn</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              disabled={!isEditing.personal}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing.personal}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Telefon</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing.personal}
                className="pl-10"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="location">Lokation</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                disabled={!isEditing.personal}
                className="pl-10"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="bio">Bio / Kort beskrivelse</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              disabled={!isEditing.personal}
              rows={3}
              placeholder="Fortæl kort om dig selv og dine interesser..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
