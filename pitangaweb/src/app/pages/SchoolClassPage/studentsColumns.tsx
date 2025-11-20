import { ColumnDef } from "@tanstack/react-table";

import { User } from "@/types/school-class.types";

import { CompletedChallengesCount } from "@/infra/data/challenges.rest";

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
      enableGlobalFilter: false,
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
