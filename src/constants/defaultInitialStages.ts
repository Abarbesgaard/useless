import { Briefcase, Mail, Phone, Users } from "lucide-react";
import { Stage } from "../types/stages";
export const defaultInitialStages: Stage[] = [
  { id: "jobpost", name: "Job Post", icon: Briefcase },
  { id: "mailsent", name: "Mail Sent", icon: Mail },
  { id: "callmade", name: "Call Made", icon: Phone },
  { id: "meeting", name: "Meeting", icon: Users },
];
