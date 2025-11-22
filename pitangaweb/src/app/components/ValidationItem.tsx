import { forwardRef, useState } from "react";
import { ChevronDownIcon, CircleCheckBigIcon, CircleXIcon } from "lucide-react";

import type { ValidationResult, ValidationStatus } from "@/types/validations.type";

import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const STATUS_STYLES: Record<ValidationStatus | "null", string> = {
  null: "bg-neutral text-neutral-foreground",
  FAIL: "border-2 border-error",
  PASS: "border-2 border-success"
};

export const ValidationItem = forwardRef<HTMLDivElement, ValidationResult>(
  ({ status, expectedOutput, input, output }, ref) => {
    const [open, setOpen] = useState(true);
    const style = STATUS_STYLES[status ?? "null"];

    return (
      <Collapsible ref={ref} open={open} onOpenChange={setOpen} asChild>
        <Card className={cn("border p-3 transition", style)}>
          <CollapsibleTrigger className="cursor-pointer w-full flex justify-between items-center text-left">
            <div className="pr-3 flex items-center justify-between grow">
              <div>
                <p>
                  <strong>Input:</strong>{" "}
                  {input?.trim()?.length ? input : "Sem input"}
                </p>

                <p className="font-bold">
                  Output esperado: {expectedOutput}
                </p>
              </div>

              {status === 'PASS' &&
                <CircleCheckBigIcon className="text-success" />
              }
              {status === 'FAIL' &&
                <CircleXIcon className="text-error" />
              }
            </div>

            <ChevronDownIcon
              className={cn(
                "w-5 h-5 transition-transform duration-200 ease-in-out",
                open && "rotate-180"
              )}
            />
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="mt-2 rounded bg-muted p-3 border select-text">
              {output}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  }
);

