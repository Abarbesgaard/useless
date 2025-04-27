import { LucideIcon } from "lucide-react";

export type Stage = {
  id?: string;
  name: string;
  icon: LucideIcon | string;
  position: number | null;
  application_id: string | null;
  auth_user?: string | null;
};
