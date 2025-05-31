import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { User } from "lucide-react";
import { User as UserType } from "@supabase/supabase-js";

interface UserProfileHeaderProps {
  user: UserType | null;
  formData: {
    firstName: string;
    lastName: string;
    currentTitle: string;
  };
  getInitials: () => string;
}

export default function Header({
  user,
  formData,
  getInitials,
}: UserProfileHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="cursor-pointer" />
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <User className="h-6 w-6" />
          Min Profil
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">
            {formData.firstName} {formData.lastName}
          </p>
          <p className="text-sm text-muted-foreground">
            {formData.currentTitle}
          </p>
        </div>
      </div>
    </div>
  );
}
