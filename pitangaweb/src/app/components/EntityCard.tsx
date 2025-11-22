import { forwardRef } from "react";

import { cn } from "@/lib/utils";

import { Separator } from "@/components/ui/separator";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";

interface EntityCardProps {
  header: React.ReactNode;
  footer: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const EntityCard = forwardRef<HTMLDivElement, EntityCardProps>(
  ({ header, footer, description, className, fullWidth }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          `
            flex
            flex-col
            w-full
          `,
          !fullWidth && `
            sm:w-[calc(50%-0.5rem)]
            lg:w-[calc(33%-0.5rem)]
          `,
          className
        )}
      >
        <CardHeader className="px-6 py-4 flex flex-row grow gap-2 space-y-0 justify-between">
          {header}
        </CardHeader>

        {description && (description)}

        <Separator />

        <CardFooter className="px-6 py-2 flex justify-between">
          {footer}
        </CardFooter>
      </Card>
    );
  }
);

EntityCard.displayName = 'EntityCard';
