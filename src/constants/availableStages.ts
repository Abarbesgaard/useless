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
  { id: "jobpost", name: "Job Post", icon: Briefcase },
  { id: "mailsent", name: "Mail Sent", icon: Mail },
  { id: "callmade", name: "Call Made", icon: Phone },
  { id: "meeting", name: "Meeting", icon: Users },
  { id: "techtest", name: "Technical Test", icon: FileText },
  { id: "interview", name: "Interview", icon: Calendar },
  { id: "offer", name: "Offer", icon: DollarSign },
  { id: "acceptance", name: "Acceptance", icon: Award },
  { id: "rejection", name: "Rejection", icon: X },
];
