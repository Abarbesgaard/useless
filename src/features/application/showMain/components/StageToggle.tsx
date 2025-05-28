import { Application } from "../types/application";
import { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";

import {
  Award,
  Check,
  MinusCircle,
  FileText,
  Mail,
  Phone,
  Calendar,
  User,
  Clock,
  Video,
  MessageSquare,
  FileCheck,
  Building,
  Briefcase,
  ClipboardCheck,
  Send,
  AlertCircle,
  Linkedin,
  Ghost,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Award,
  Check,
  MinusCircle,
  FileText,
  Mail,
  Phone,
  Calendar,
  User,
  Clock,
  Video,
  MessageSquare,
  FileCheck,
  Building,
  Briefcase,
  ClipboardCheck,
  Send,
  AlertCircle,
  Linkedin,
  Ghost,
};

const resolveIcon = (iconName: string | LucideIcon): LucideIcon => {
  if (typeof iconName !== "string") {
    return iconName || FileText;
  }

  if (!iconName) {
    return FileText;
  }

  return iconMap[iconName] || FileText;
};

interface StageToggleProps {
  app: Application;
  toggleStageCompletion: (appId: string, stageIndex: number) => Promise<void>;
  deleteStage: (appId: string, stageIndex: number) => Promise<void>;
}

export default function StageToggle({
  app,
  toggleStageCompletion,
  deleteStage,
}: StageToggleProps) {
  return (
    <TooltipProvider>
      {app.stages &&
        app.stages.map((stage, stageIndex) => {
          const IconComponent =
            typeof stage.icon === "string"
              ? resolveIcon(stage.icon)
              : stage.icon || FileText;

          const isActive = stageIndex <= app.currentStage;

          return (
            <div key={stageIndex} className="flex items-center">
              <div className="relative group">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => toggleStageCompletion(app.id, stageIndex)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer 
                                ${
                                  isActive
                                    ? "bg-chart-1"
                                    : "bg-sidebar-foreground hover:bg-primary"
                                }`}
                    >
                      {IconComponent && (
                        <IconComponent
                          size={24}
                          className={
                            isActive ? "text-foreground" : "text-sidebar-ring"
                          }
                        />
                      )}

                      {!isActive && (
                        <div className="absolute inset-0 bg-chart-1 bg-opacity-75 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Check size={24} className="text-foreground" />
                        </div>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-xs">
                      {stage.note && stage.note.trim() && (
                        <p className="text-xs text-primary-foreground mt-1 whitespace-pre-wrap break-words">
                          {stage.note}
                        </p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>

                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-center w-24">
                  {stage.name}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteStage(app.id, stageIndex);
                  }}
                  className="opacity-0 group-hover:opacity-100 absolute -top-2 -right-2 bg-chart-5 text-primary rounded-full p-1 transition-opacity"
                  title="Delete this stage"
                >
                  <MinusCircle size={16} />
                </button>
              </div>
              {stageIndex < app.stages.length - 1 && (
                <div
                  className={`h-0.5 w-8 ${
                    stageIndex < app.currentStage
                      ? "bg-sidebar-primary"
                      : "bg-muted-foreground"
                  }`}
                ></div>
              )}
            </div>
          );
        })}
    </TooltipProvider>
  );
}
