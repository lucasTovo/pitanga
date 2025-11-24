import { ColumnDef } from "@tanstack/react-table";

import { User } from "@/types/school-class.types";
import { Challenge, ChallengeLevel } from "@/types/challenges.types";

import { CompletedChallengesCount } from "@/infra/data/challenges.rest";

import { DifficultyLevelBadge, difficultyLevelStyles } from "@/app/components/DifficultyLevelBadge";

export const difficultyOrder: Record<ChallengeLevel, number> = {
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
];

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
      const isCompleted = completedSummary?.[row.id].completedChallenges.includes(challenge.id);
      return isCompleted;
    },
    cell: ({ row }) => {
      const isCompleted = completedSummary?.[row.original.id].completedChallenges.includes(challenge.id);
      return `${isCompleted ? 'Completado' : 'Incompleto'}`;
    },
  },
]
