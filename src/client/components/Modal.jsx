import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Modal = ({
  title,
  body,
  cancelBtn = false,
  cancelBtnText = "Cancel",
  confirmBtnText = "Confirm",
  onClose,
  onConfirm,
}) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    setOpen(false);
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <div className="mt-2">{body}</div>
          </DialogHeader>
          <DialogFooter>
            {cancelBtn && (
              <Button onClick={handleClose}>{cancelBtnText}</Button>
            )}
            <Button onClick={handleConfirm}>{confirmBtnText}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default Modal;
