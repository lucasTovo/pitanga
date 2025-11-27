import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
  modal?: boolean;
}

export function ActionDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  variant = "default",
  onConfirm,
  modal = true,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={modal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-center'>{title}</DialogTitle>
          <DialogDescription className='text-center whitespace-pre-line'>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="hover:bg-secondary"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Cancelar
            </Button>
          </DialogClose>

          <Button variant={variant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
