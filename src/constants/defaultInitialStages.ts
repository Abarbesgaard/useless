import { Briefcase, Mail, Phone, Users } from "lucide-react";
import { Stage } from "../types/stages";
export const defaultInitialStages: Stage[] = [
  { id: "jobpost", name: "Job Post", icon: Briefcase, position: 0 },
  { id: "mailsent", name: "Mail Sent", icon: Mail, position: 1 },
  { id: "callmade", name: "Call Made", icon: Phone, position: 2 },
  { id: "meeting", name: "Meeting", icon: Users, position: 3 },
];
