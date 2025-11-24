import { forwardRef } from "react";
import { ArrowUpRightIcon, EyeOffIcon, PencilIcon, Trash2Icon } from "lucide-react";

import type { Challenge } from "@/types/challenges.types";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { EntityCard } from "@/app/components/EntityCard";
import { DifficultyLevelBadge } from "@/app/components/DifficultyLevelBadge";

interface ChallengeCardProps {
  challenge: Challenge;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onAction?: (id: string) => void;
  actionLabel?: string;
  fullWidth?: boolean;
}

export const ChallengeCard = forwardRef<HTMLDivElement, ChallengeCardProps>(
  ({ challenge, onDelete, onEdit, onAction, actionLabel = 'Acessar o desafio', fullWidth }, ref) => {
  return (
    <EntityCard
      ref={ref}
      fullWidth={fullWidth}
      header={
        <div className="w-full flex flex-col justify-between">
          <CardTitle className="flex justify-between items-center gap-2">
            <span className="truncate">
              {challenge.title}
            </span>
            <div className="flex gap-2 items-center">
              {!challenge.isPublic && (
                <EyeOffIcon className="text-neutral-500" />
              )}
              <DifficultyLevelBadge level={challenge.level} />
            </div>
          </CardTitle>

          {challenge.description &&
            <CardDescription className='mt-2 max-h-10 overflow-hidden'>
              <div
                className='revert-all description-container line-clamp-2'
                dangerouslySetInnerHTML={{ __html: challenge.description }}
              />
            </CardDescription>
          }
        </div>
      }
      footer={
        <>
          <ButtonGroup>
            {onDelete &&
              <Button
                size="icon"
                variant="outline"
                className="hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => onDelete(challenge.id)}
              >
                <Trash2Icon />
              </Button>
            }

            {onEdit &&
              <Button
                size="icon"
                variant="outline"
                className="hover:bg-secondary"
                onClick={() => onEdit(challenge.id)}
              >
                <PencilIcon />
              </Button>
            }
          </ButtonGroup>

          {onAction &&
            <Button
              size="sm"
              className="font-semibold"
              onClick={() => onAction(challenge.id)}
            >
              {actionLabel}
              <ArrowUpRightIcon />
            </Button>
          }
        </>
      }
    />
  );
});
