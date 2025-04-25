import {
  Briefcase,
  Mail,
  Phone,
  Users,
  FileText,
  Calendar,
  DollarSign,
  Award,
  X,
} from "lucide-react";
import { Stage } from "../types/stages";

export const availableStages: Stage[] = [
  { id: "jobpost", name: "Job Post", icon: Briefcase, position: null },
  { id: "mailsent", name: "Mail Sent", icon: Mail, position: null },
  { id: "callmade", name: "Call Made", icon: Phone, position: null },
  { id: "meeting", name: "Meeting", icon: Users, position: null },
  { id: "techtest", name: "Technical Test", icon: FileText, position: null },
  { id: "interview", name: "Interview", icon: Calendar, position: null },
  { id: "offer", name: "Offer", icon: DollarSign, position: null },
  { id: "acceptance", name: "Acceptance", icon: Award, position: null },
  { id: "rejection", name: "Rejection", icon: X, position: null },
];
