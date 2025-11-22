import { useState } from "react";
import { SearchIcon } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  searchPlaceholder?: string;
}

export const DataTable = <TData,>({ columns, data, searchPlaceholder }: DataTableProps<TData>) => {
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <div className="h-full flex flex-col flex-1 gap-4">
      {/* Campo de pesquisa */}
      <div className="relative w-full max-w-sm ml-auto">
        <Input
          placeholder={searchPlaceholder ?? "Pesquisar..."}
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full pr-9 bg-neutral dark:bg-neutral-900 focus-visible:ring-0"
        />
        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      {/* Table header */}
      <div className="rounded-lg border overflow-hidden flex flex-col">
        <Table className='bg-neutral-50 dark:bg-neutral-800 table-fixed'>
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
                        header.column.getCanSort() && 'cursor-pointer select-none',
                        isLast && ['text-right', 'pr-4']
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
        </Table>

        {/* Table body */}
        <ScrollArea className="flex flex-1" >
          <Table className='rounded bg-neutral-50 dark:bg-neutral-800 table-fixed'>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell, index) => {
                      const isLast = index === row.getVisibleCells().length - 1;
                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(isLast && ['text-right', 'pr-4'])}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-6">
                    Nenhum registro encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
