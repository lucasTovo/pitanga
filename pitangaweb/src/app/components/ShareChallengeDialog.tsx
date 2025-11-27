import { forwardRef, useState } from "react";
import { CheckIcon } from "lucide-react";

import { Slot } from "@radix-ui/react-slot";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShareChallengeDialogProps {
  challengeId: string;
  children: React.ReactNode;
}

export const ShareChallengeDialog = forwardRef<
  HTMLElement,
  ShareChallengeDialogProps
>(({ challengeId, children }, ref) => {
  const [copied, setCopied] = useState(false);

  const url = `${window.location.origin}/pitanga/challenges/public/${challengeId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Slot ref={ref}>{children}</Slot>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar desafio</DialogTitle>
          <DialogDescription>
            Copie o link abaixo e envie para quem você quiser.
          </DialogDescription>
        </DialogHeader>

        <div>
          <Input
            readOnly
            value={url}
            onFocus={(e) => e.target.select()}
          />

          {copied && (
            <p className="text-sm text-success mt-2">
              Link copiado com sucesso!
            </p>
          )}
        </div>

        <DialogFooter className="flex gap-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant='ghost'
            >
              Cancelar
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={handleCopy}
          >
            {copied ? <CheckIcon /> : 'Copiar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

ShareChallengeDialog.displayName = "ShareChallengeDialog";
