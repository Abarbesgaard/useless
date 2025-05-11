import { Application } from "@/types/application";
import { LucideIcon } from "lucide-react";

import {
  Check,
  MinusCircle,
  FileText,
  // Import all icons you're using in your application
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
  // Add any other icons you might be using
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  // Include all icons with exact matching names
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
  // Add more icons as needed
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
    <>
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
                <button
                  onClick={() => toggleStageCompletion(app.id, stageIndex)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors 
                            ${
                              isActive
                                ? "bg-blue-500"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                >
                  {IconComponent && (
                    <IconComponent
                      size={24}
                      className={isActive ? "text-white" : "text-gray-500"}
                    />
                  )}

                  {!isActive && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-75 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Check size={24} className="text-white" />
                    </div>
                  )}
                </button>
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-center w-24">
                  {stage.name}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteStage(app.id, stageIndex);
                  }}
                  className="opacity-0 group-hover:opacity-100 absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 transition-opacity"
                  title="Delete this stage"
                >
                  <MinusCircle size={16} />
                </button>
              </div>
              {stageIndex < app.stages.length - 1 && (
                <div
                  className={`h-0.5 w-8 ${
                    stageIndex < app.currentStage
                      ? "bg-blue-500"
                      : "bg-gray-200"
                  } mx-1`}
                ></div>
              )}
            </div>
          );
        })}
    </>
  );
}
