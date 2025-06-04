import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Share2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ShareProfileDialogProps {
  userId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any;
}

const ShareProfileDialog: React.FC<ShareProfileDialogProps> = ({ userId }) => {
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateShare = async () => {
    setIsLoading(true);
    try {
      // Use the user ID directly as the share ID
      const shareId = userId;
      const url = `${window.location.origin}/shared-profile/${shareId}`;
      setShareUrl(url);
      toast.success("Delingslink oprettet!");
    } catch (error) {
      console.error("Error creating share:", error);
      toast.error("Fejl ved oprettelse af delingslink");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link kopieret til udklipsholder!");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Fejl ved kopiering af link");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Del Profil
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Del din profil</DialogTitle>
          <DialogDescription>
            Opret et delingslink til din profil, som du kan sende til
            potentielle arbejdsgivere.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {!shareUrl ? (
            <Button
              onClick={handleCreateShare}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Opretter..." : "Opret delingslink"}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Link oprettet!</span>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="share-url" className="sr-only">
                  Delingslink
                </Label>
                <Input
                  id="share-url"
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Dette link giver adgang til en offentlig version af din profil.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProfileDialog;
