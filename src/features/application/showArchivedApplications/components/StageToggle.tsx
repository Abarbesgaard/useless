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
                                ${app.is_archived ? 'opacity-60' : ''} ${
                                  isActive
                                    ? app.is_archived 
                                      ? "bg-muted" 
                                      : "bg-chart-1"
                                    : app.is_archived
                                      ? "bg-muted-foreground/20 hover:bg-muted-foreground/30"
                                      : "bg-sidebar-foreground hover:bg-primary"
                                }`}
                    >
                      {IconComponent && (
                        <IconComponent
                          size={24}
                          className={
                            isActive 
                              ? app.is_archived 
                                ? "text-muted-foreground" 
                                : "text-foreground"
                              : app.is_archived
                                ? "text-muted-foreground/60"
                                : "text-sidebar-ring"
                          }
                        />
                      )}

                      {!isActive && !app.is_archived && (
                        <div className="absolute inset-0 bg-chart-1 bg-opacity-75 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Check size={24} className="text-foreground" />
                        </div>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-xs">
                      {app.is_archived && (
                        <p className="text-xs text-muted-foreground mb-1 italic">
                          Archived Application
                        </p>
                      )}
                      {stage.note && stage.note.trim() && (
                        <p className="text-xs text-primary-foreground mt-1 whitespace-pre-wrap break-words">
                          {stage.note}
                        </p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>

                <span className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-center w-24 ${
                  app.is_archived ? 'text-muted-foreground' : ''
                }`}>
                  {stage.name}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteStage(app.id, stageIndex);
                  }}
                  className={`opacity-0 group-hover:opacity-100 absolute -top-2 -right-2 rounded-full p-1 transition-opacity ${
                    app.is_archived 
                      ? 'bg-muted text-muted-foreground' 
                      : 'bg-chart-5 text-primary'
                  }`}
                  title="Delete this stage"
                >
                  <MinusCircle size={16} />
                </button>
              </div>
              {stageIndex < app.stages.length - 1 && (
                <div
                  className={`h-0.5 w-8 mx-1 ${
                    stageIndex < app.currentStage
                      ? app.is_archived
                        ? "bg-muted-foreground/40"
                        : "bg-sidebar-primary"
                      : app.is_archived
                        ? "bg-muted-foreground/20"
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
