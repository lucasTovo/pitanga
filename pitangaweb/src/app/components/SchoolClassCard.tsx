import { forwardRef } from "react";
import { ArrowUpRightIcon, ClipboardListIcon, PencilIcon, Trash2Icon, UserIcon } from "lucide-react";

import type { SchoolClass } from "@/types/school-class.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { EntityCard } from "@/app/components/EntityCard";

interface SchoolClassCardProps {
  schoolClass: SchoolClass;
  onDelete: (id: string) => void;
  onEdit: (schoolClass: SchoolClass) => void;
  onOpen: (id: string) => void;
}

export const SchoolClassCard = forwardRef<HTMLDivElement, SchoolClassCardProps>(
  ({ schoolClass, onDelete, onEdit, onOpen }, ref) => {
  return (
    <EntityCard
      ref={ref}
      header={
        <div className='flex flex-row grow gap-2 space-y-0 justify-between'>
          <div>
            <CardTitle className="mb-2">
              {schoolClass.name}
            </CardTitle>

            <CardDescription className="mt-2 max-h-10 overflow-hidden multiline-ellipsis">
              {schoolClass.description}
            </CardDescription>
          </div>

          <div className='flex flex-col gap-2 items-start'>
            <Badge variant="outline" className='text-sm font-bold text-primary border-2 border-primary'>
              <UserIcon className='mr-1' />
              {schoolClass.count.students}
            </Badge>
            <Badge variant="outline" className='text-sm font-bold text-primary border-2 border-primary'>
              <ClipboardListIcon className='mr-1'/>
              {schoolClass.count.challenges}
            </Badge>
          </div>
        </div>
      }
      footer={
        <>
          <ButtonGroup>
            <Button
              size="icon"
              variant="outline"
              className="hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => onDelete(schoolClass.id)}
            >
              <Trash2Icon />
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="hover:bg-secondary"
              onClick={() => onEdit(schoolClass)}
            >
              <PencilIcon />
            </Button>
          </ButtonGroup>

          <Button
            size="sm"
            className="font-semibold"
            onClick={() => onOpen(schoolClass.id)}
          >
            Acessar turma
            <ArrowUpRightIcon />
          </Button>
        </>
      }
    />
  )
});
