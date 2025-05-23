import { Briefcase, Mail, Phone, Users } from "lucide-react";
import { Stage } from "../types/stages";
export const defaultInitialStages: Stage[] = [
  {
    id: crypto.randomUUID(),
    name: "Job Post",
    icon: Briefcase,
    position: 0,
    auth_user: null,
    application_id: null,
  },
  {
    id: crypto.randomUUID(),

    name: "Mail Sent",
    icon: Mail,
    position: 1,
    application_id: null,
    auth_user: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Call Made",
    icon: Phone,
    position: 2,
    application_id: null,
    auth_user: null,
  },
  {
    id: crypto.randomUUID(),

    name: "Meeting",
    icon: Users,
    position: 3,
    application_id: null,
    auth_user: null,
  },
];
