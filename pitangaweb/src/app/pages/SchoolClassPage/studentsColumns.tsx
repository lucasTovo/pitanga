import { CircleCheckBigIcon, CircleXIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { User } from "@/types/school-class.types";
import { Challenge } from "@/types/challenges.types";

import { CompletedChallengesCount } from "@/infra/data/challenges.rest";
import { difficultyOrder } from "./challengesColumns";

import { DifficultyLevelBadge, difficultyLevelStyles } from "@/app/components/DifficultyLevelBadge";

export const studentsColumns = (
  completedSummary: Record<string, CompletedChallengesCount> | null,
  challengesCount: number
): ColumnDef<User>[] => [
  {
    accessorKey: 'name',
    header: 'Nome',
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
    id: "completedCount",
    header: "Desafios Concluídos",
    accessorFn: (student: User) => {
      return completedSummary?.[student.id]?.count ?? 0;
    },
    cell: ({ row }) => {
      const student = row.original;
      const count = completedSummary?.[student.id]?.count ?? 0;
      return `${count}/${challengesCount}`;
    },
  },
];

export const studentsSubTableColumns = (
  user: User,
  completedSummary: Record<string, CompletedChallengesCount> | null,
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
    id: 'status',
    header: 'Status',
    accessorFn: (row) => {
      const isCompleted = completedSummary?.[user.id].completedChallenges.includes(row.id);
      return isCompleted;
    },
    cell: ({ row }) => {
      const isCompleted = completedSummary?.[user.id].completedChallenges.includes(row.original.id);
      return isCompleted
        ? <CircleCheckBigIcon className="ml-auto text-success" />
        : <CircleXIcon className="ml-auto text-error" />;
    },
  },
];
