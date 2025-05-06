import { Stage } from "@/types/stages";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";

interface StageSelectorProps {
  appId: string;
  stageSelectorApp: string | number | null;
  toggleStageSelector: (id: string) => void;
  addStageToApplication: (appId: string, stage: Stage) => void;
  availableStages: Stage[];
}
export const StageSelector: React.FC<StageSelectorProps> = ({
  appId,
  stageSelectorApp,
  toggleStageSelector,
  addStageToApplication,
  availableStages,
}) => {
  return (
    <Popover
      open={stageSelectorApp === appId}
      onOpenChange={() => toggleStageSelector(appId)}
    >
      <PopoverTrigger asChild>
        <div>
          <Button
            onClick={() => toggleStageSelector(appId)}
            className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <PlusCircle size={24} className="text-gray-600" />
          </Button>
          <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-center w-24">
            Add Stage
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <p className="mb-2 text-sm font-semibold">Select a stage to add:</p>
        <div className="space-y-1">
          {availableStages.map((stage, index) => {
            const StageIcon = stage.icon;
            return (
              <div
                key={index}
                onClick={() => addStageToApplication(appId, stage)}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
              >
                <StageIcon className="w-4 h-4" />
                {stage.name}
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
