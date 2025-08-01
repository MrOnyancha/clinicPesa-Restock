import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const ClearForm = () => {
    const [showClearDialog, setShowClearDialog] = useState(false);

    const handleClearForm = () => {
      setShowClearDialog(false);
    };
    
    return (
        <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Form</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear all fields? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleClearForm}>
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}

export default ClearForm;