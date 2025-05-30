import { Stage } from "../types/stages";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover";
import { Button } from "../../../../components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import { Textarea } from "../../../../components/ui/textarea";
import { Label } from "../../../../components/ui/label";
import confetti from "canvas-confetti";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";

interface StageSelectorProps {
  appId: string;
  stageSelectorApp: string | number | null;
  toggleStageSelector: (id: string) => void;
  addStageToApplication: (appId: string, stage: Stage, note?: string) => void;
  availableStages: Stage[];
}

export const StageSelector: React.FC<StageSelectorProps> = ({
  appId,
  stageSelectorApp,
  toggleStageSelector,
  addStageToApplication,
  availableStages,
}) => {
  const [notePopoverOpen, setNotePopoverOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [note, setNote] = useState("");

  const stagesByCategory = availableStages.reduce((acc, stage) => {
    const category = stage.category || "General"; // Use "General" as default category
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(stage);
    return acc;
  }, {} as Record<string, Stage[]>);
  const categories = Object.keys(stagesByCategory);
  const defaultCategory = categories[0] || "General";

  const handleStageClick = (stage: Stage) => {
    setSelectedStage(stage);
    setNote("");
    setNotePopoverOpen(true);
  };

  const handleNoteSubmit = () => {
    if (!selectedStage) return;

    if (selectedStage.id === "acceptance") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
      }, 250);

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 400);
    }

    // Add the stage to application with note
    addStageToApplication(appId, selectedStage, note.trim() || undefined);

    // Reset state
    setNotePopoverOpen(false);
    setSelectedStage(null);
    setNote("");
    toggleStageSelector(appId); // Close the main popover
  };

  const handleNoteCancel = () => {
    setNotePopoverOpen(false);
    setSelectedStage(null);
    setNote("");
  };

  return (
    <>
      <Popover
        open={stageSelectorApp === appId}
        onOpenChange={() => toggleStageSelector(appId)}
      >
        <PopoverTrigger asChild>
          <div>
            <Button
              onClick={() => toggleStageSelector(appId)}
              className="w-12 h-12 rounded-full bg-primary hover:bg-popover-foreground flex items-center justify-center cursor-pointer"
            >
              <PlusCircle className="text-sidebar-ring" />
            </Button>
            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-center w-24">
              Add Stage
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-2">
          <p className="mb-2 text-sm font-semibold">Select a stage to add:</p>

          <Tabs defaultValue={defaultCategory} className="w-full">
            <TabsList className="grid grid-flow-col auto-cols-fr overflow-x-auto mb-2">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="text-xs"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {stagesByCategory[category].map((stage, index) => {
                    const StageIcon = stage.icon;

                    return (
                      <TooltipProvider key={index}>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <div
                              onClick={() => handleStageClick(stage)}
                              className="flex items-center gap-2 p-2 rounded hover:text-primary hover:bg-chart-5 cursor-pointer "
                            >
                              <StageIcon className="w-4 h-4" />
                              <span>{stage.name}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right" align="center">
                            <p className="max-w-xs">
                              Click to add {stage.name} stage to your
                              application
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </PopoverContent>
      </Popover>

      {/* Note Input Popover */}
      <Dialog open={notePopoverOpen} onOpenChange={setNotePopoverOpen}>
        <DialogContent className="w-80 p-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedStage && (
                <>
                  <selectedStage.icon className="w-4 h-4" />
                  <span className="font-semibold text-sm">
                    {selectedStage.name}
                  </span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="stage-note" className="text-sm">
                Add a note (optional)
              </Label>
              <Textarea
                id="stage-note"
                placeholder="Enter your note here..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={handleNoteCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleNoteSubmit}>
                Add Stage
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
