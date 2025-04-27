import { Briefcase, Mail, Phone, Users } from "lucide-react";
import { Stage } from "../types/stages";
export const defaultInitialStages: Stage[] = [
  {
    id: "jobpost",
    name: "Job Post",
    icon: Briefcase,
    position: 0,
    auth_user: null,
    application_id: null,
  },
  {
    id: "mailsent",
    name: "Mail Sent",
    icon: Mail,
    position: 1,
    application_id: null,
    auth_user: null,
  },
  {
    id: "callmade",
    name: "Call Made",
    icon: Phone,
    position: 2,
    application_id: null,
    auth_user: null,
  },
  {
    id: "meeting",
    name: "Meeting",
    icon: Users,
    position: 3,
    application_id: null,
    auth_user: null,
  },
];
