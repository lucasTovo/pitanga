import { ColumnDef } from "@tanstack/react-table";
import { CircleCheckBigIcon, CircleEllipsisIcon, CircleXIcon, PencilIcon, Trash2Icon } from "lucide-react";

import { User } from "@/types/school-class.types";
import { Challenge, ChallengeLevel } from "@/types/challenges.types";

import { CompletedChallengesCount } from "@/infra/data/challenges.rest";

import { DifficultyLevelBadge, difficultyLevelStyles } from "@/app/components/DifficultyLevelBadge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useActionDialog } from "@/app/hooks/useActionDialog";
import { useQueryClient } from "@tanstack/react-query";
import { ActionDialog } from "@/app/components/ActionDialog";
import { useNavigate } from "react-router-dom";
import { removeChallengeFromClass } from "@/infra/data/school.rest";

export const difficultyOrder: Record<ChallengeLevel, number> = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
  PRO: 4,
};

export const challengesColumns = (
  getStudentsSolvedCount: (id: string) => number,
  studentsCount: number,
  schoolClassId: string,
): ColumnDef<Challenge>[] => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    open,
    setOpen,
    config,
    showDialog,
    handleConfirm
  } = useActionDialog();

  const handleEditChallenge = (id: string) => {
      navigate(`/challenges/${id}/edit`);
    }

  const handleRemoveChallenge = (schoolClassId: string, challengeId: string) => {
    showDialog({
      title: 'Remover desafio?',
      description: `O desafio será removido da turma.`,
      confirmLabel: 'Remover',
      variant: 'destructive',
      action: async () => {
        await removeChallengeFromClass(schoolClassId, challengeId);
        queryClient.invalidateQueries({ queryKey: ['class', schoolClassId] });
      },
    });
  }


  return [
    {
      id: 'title',
      header: 'Desafio',
      accessorFn: (row) => row.title.toLowerCase(),
      cell: ({ row }) => row.original.title,
    },
    {
      id: 'level',
      header: 'Dificuldade',
      accessorFn: (row) => difficultyLevelStyles[row.level].label,
      sortingFn: (rowA, rowB) => {
        const levelA = difficultyOrder[rowA.original.level];
        const levelB = difficultyOrder[rowB.original.level];
        return levelA - levelB;
      },
      cell: ({ row }) => <DifficultyLevelBadge level={row.original.level} />,
    },
    {
      id: "studentsWhoSolved",
      header: "Alunos que resolveram",
      accessorFn: (row) => getStudentsSolvedCount(row.id),
      cell: ({ row }) => `${getStudentsSolvedCount(row.original.id)}/${studentsCount}`,
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) =>
        <>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <CircleEllipsisIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onSelect={() => handleEditChallenge(row.original.id)}
                  onClick={(e) => {
                  e.stopPropagation();
                }}
                >
                  <PencilIcon />
                  Editar desafio
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleRemoveChallenge(schoolClassId, row.original.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Trash2Icon />
                  Remover desafio
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <ActionDialog
            open={open}
            onOpenChange={setOpen}
            title={config.title}
            description={config.description}
            confirmLabel={config.confirmLabel}
            variant={config.variant}
            onConfirm={handleConfirm}
          />
        </>
    }
  ];
}



export const challengesSubTableColumns = (
  challenge: Challenge,
  completedSummary: Record<string, CompletedChallengesCount> | null,
): ColumnDef<User>[] => [
  {
    id: 'name',
    header: 'Nome',
    accessorFn: (row) => row.name.toLowerCase(),
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const email = row.original.email;
      return (
        <span className="block max-w-[250px] truncate">
          {email}
        </span>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    enableGlobalFilter: false,
    accessorFn: (row) => {
      const isCompleted = completedSummary?.[row.id]?.completedChallenges?.includes(challenge.id) ?? false;
      return isCompleted;
    },
    cell: ({ row }) => {
      const isCompleted = completedSummary?.[row.original.id]?.completedChallenges?.includes(challenge.id);
      return isCompleted
        ? <CircleCheckBigIcon className="ml-auto text-success" />
        : <CircleXIcon className="ml-auto text-error" />;
    },
  },
]
