import { forwardRef } from "react";
import { ArrowUpRightIcon, CircleCheckBigIcon, EyeOffIcon, PencilIcon, Share2Icon, Trash2Icon } from "lucide-react";

import type { Challenge } from "@/types/challenges.types";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EntityCard } from "@/app/components/EntityCard";
import { ShareChallengeDialog } from "@/app/components/ShareChallengeDialog";
import { DifficultyLevelBadge } from "@/app/components/DifficultyLevelBadge";

interface ChallengeCardProps {
  challenge: Challenge;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onAction?: (id: string) => void;
  actionLabel?: string;
  fullWidth?: boolean;
  done?: boolean; // usado apenas na visualização dos desafios da turma pelo aluno
}

export const ChallengeCard = forwardRef<HTMLDivElement, ChallengeCardProps>(
  ({ challenge, onDelete, onEdit, onAction, actionLabel = 'Acessar o desafio', fullWidth, done = false }, ref) => {
  return (
    <EntityCard
      ref={ref}
      fullWidth={fullWidth}
      header={
        <div className="w-full flex flex-col justify-between">
          <CardTitle className="flex justify-between items-start gap-3">
            <div className="flex flex-col gap-2 items-start min-w-0">
              <DifficultyLevelBadge level={challenge.level} />
              <span className="w-full truncate">{challenge.title}</span>
            </div>

            <div>
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    {(challenge.isPublic) ? (
                      <ShareChallengeDialog challengeId={challenge.id}>
                        <Button variant="secondary" size="icon">
                          <Share2Icon />
                        </Button>
                      </ShareChallengeDialog>
                    ) : (
                      <Button
                        size='icon'
                        className="bg-muted text-muted-foreground hover:bg-muted cursor-default"
                        aria-disabled
                      >
                        <EyeOffIcon />
                      </Button>
                    )}
                  </TooltipTrigger>
                  <TooltipContent className="bg-muted text-muted-foreground">
                    {(challenge.isPublic) ? (
                      <p>Compartilhar desafio</p>
                    ) : (
                      <p>Desafio privado</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
          {done && (
            <CircleCheckBigIcon className="text-success" />
          )}

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
