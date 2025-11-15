import { useState } from "react";

import type { ValidationResult, ValidationStatus } from "@/types/validations.type";

import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDownIcon } from "lucide-react";

const STATUS_STYLES: Record<ValidationStatus | "null", string> = {
  null: "bg-neutral text-neutral-foreground",
  FAIL: "bg-error text-error-foreground",
  PASS: "bg-success text-success-foreground"
};

export const ValidationItem = ({
  status,
  expectedOutput,
  input,
  output,
}: ValidationResult) => {
  const [open, setOpen] = useState(true);
  const style = STATUS_STYLES[status ?? "null"];

  return (
    <Collapsible open={open} onOpenChange={setOpen} asChild>
      <Card className={cn("border p-2 transition", style)}>
        <CollapsibleTrigger className="cursor-pointer w-full flex justify-between items-center text-left">
          <div className="pb-1">
            <p>
              <strong>Input:</strong>{" "}
              {input?.trim()?.length ? input : "Sem input"}
            </p>

            <p className="font-bold">
              Output esperado: {expectedOutput}
            </p>
          </div>

          <ChevronDownIcon
            className={cn(
              "w-5 h-5 transition-transform duration-200 ease-in-out",
              open && "rotate-180"
            )}
          />
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="mt-2 rounded bg-neutral-800 text-neutral-100 p-3 border select-text">
            {output}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

