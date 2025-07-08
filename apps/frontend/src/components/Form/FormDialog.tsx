import { FormButton } from "@/components/Form/FormButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";
import { Dispatch, SetStateAction, ReactNode } from "react";

interface FormDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  description: string;
  children: ReactNode;
  onSubmit: () => void;
  onClose: () => void;
  isPending?: boolean;
  isValid?: boolean;
  submitButtonText: string;
  loadingText: string;
  cancelButtonText?: string;
}

export const FormDialog = ({
  isOpen,
  setIsOpen,
  title,
  description,
  children,
  onSubmit,
  onClose,
  isPending = false,
  isValid = true,
  submitButtonText,
  loadingText,
  cancelButtonText = "Cancel",
}: FormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle />
            <Typography variant="heading" size="2xl">
              {title}
            </Typography>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4">
            <div className="grid gap-3">
              {children}
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={onClose}>
                {cancelButtonText}
              </Button>
            </DialogClose>
            <FormButton
              loadingText={loadingText}
              isLoading={isPending}
              disabled={isPending || !isValid}
              type="submit"
            >
              {submitButtonText}
            </FormButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};