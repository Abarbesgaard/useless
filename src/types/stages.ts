import { LucideIcon } from "lucide-react";

export type Stage = {
  id?: string;
  name: string | null;
  icon: LucideIcon | string;
  position: number | null;
  application_id: string | null;
  auth_user?: string | null;
  is_active?: boolean | null;
};
