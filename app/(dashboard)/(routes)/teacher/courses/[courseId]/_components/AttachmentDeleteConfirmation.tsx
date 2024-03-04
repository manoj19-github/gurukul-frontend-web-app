"use client";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
interface AttachmentDeleteConfirmationProps {
  open: boolean;
  onOpenChange: any;
  confirmAction: any;
  cancelAction: any;
}
const AttachmentDeleteConfirmation: FC<AttachmentDeleteConfirmationProps> = ({
  open,
  onOpenChange,
  confirmAction,
  cancelAction,
}): JSX.Element => {
  const [isConfirmClicked, setIsConfirmClicked] = useState<boolean>(false);
  useEffect(() => {
    if (!open) setIsConfirmClicked(false);
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={() => onOpenChange()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hold on</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          if you delete this you cant revert this
        </DialogDescription>
        <DialogFooter className="flex flex-row items-center justify-end">
          <Button
            type="button"
            variant="secondary"
            className="mr-4"
            onClick={cancelAction}
          >
            Revert
          </Button>
          <Button
            disabled={isConfirmClicked}
            type="button"
            variant="secondary"
            onClick={() => {
              confirmAction();
              setIsConfirmClicked(true);
            }}
            className={`ml-3`}
          >
            {isConfirmClicked ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <></>
            )}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AttachmentDeleteConfirmation;
