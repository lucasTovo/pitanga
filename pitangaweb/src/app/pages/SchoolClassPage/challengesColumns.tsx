import { ColumnDef } from "@tanstack/react-table";

import { Challenge, ChallengeLevel } from "@/types/challenges.types";

import { DifficultyLevelBadge } from "@/app/components/DifficultyLevelBadge";

const difficultyOrder: Record<ChallengeLevel, number> = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
  PRO: 4,
};

export const challengesColumns = (
  getStudentsSolvedCount: (id: string) => number,
  studentsCount: number
): ColumnDef<Challenge>[] => [
  {
    id: 'title',
    accessorKey: 'title',
    header: 'Desafio',
    accessorFn: (row) => row.title.toLowerCase(),
    cell: ({ row }) => row.original.title,
  },
  {
    accessorKey: 'level',
    header: 'Dificuldade',
    enableGlobalFilter: false,
    accessorFn: (row) => difficultyOrder[row.level],
    cell: ({ row }) => <DifficultyLevelBadge level={row.original.level} />,
  },
  {
    id: "studentsWhoSolved",
    header: "Alunos que resolveram",
    enableGlobalFilter: false,
    accessorFn: (row) => getStudentsSolvedCount(row.id),
    cell: ({ row }) => `${getStudentsSolvedCount(row.original.id)}/${studentsCount}`,
  },
];
