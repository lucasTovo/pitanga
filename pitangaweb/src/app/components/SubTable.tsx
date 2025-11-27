import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SubTableProps<TChild, TParent> {
  data: TChild[];
  columns: ColumnDef<TChild, any>[];
  parent: TParent;
}

export function SubTable<TChild, TParent>({
  data,
  columns,
  parent
}: SubTableProps<TChild, TParent>) {

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      parent,
    },
  });

  return (
    <Table className="bg-neutral-50 dark:bg-neutral-800 table-fixed border-collapse">
      <TableHeader>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header, index) => {
              const isLast = index === hg.headers.length - 1;

              return (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className={cn(
                    'border-b',
                    header.column.getCanSort() && "cursor-pointer select-none",
                    isLast && "text-right pr-4"
                  )}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === "asc" && " ↑"}
                  {header.column.getIsSorted() === "desc" && " ↓"}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell, index) => {
              const isLast = index === row.getVisibleCells().length - 1;
              return (
                <TableCell
                  key={cell.id}
                  className={cn(isLast && "text-right pr-4")}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              )
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
