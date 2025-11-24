import { useState } from "react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SubTable } from "@/app/components/SubTable";

interface DataTableProps<TParent, TChild> {
  data: TParent[];
  columns: ColumnDef<TParent, any>[];
  children?: TChild[];
  childColumns?: (parent: TParent) => ColumnDef<TChild, any>[];
  searchPlaceholder?: string;
}

export const DataTable = <TParent, TChild = never>({
  data,
  columns,
  children,
  childColumns,
  searchPlaceholder
}: DataTableProps<TParent, TChild>) => {
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const renderCells = (row: Row<TParent>, hasChildren: boolean) =>
    row.getVisibleCells().map((cell, index) => {
      const isLast = index === row.getVisibleCells().length - 1;

      return (
        <TableCell
          key={cell.id}
        >
          <div className={cn(isLast && "pr-1 flex items-center justify-end gap-1")}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}

            {hasChildren && isLast && (
              <ChevronDownIcon
                className="
                  transition-transform duration-200 ease-in-out
                  group-data-[state=open]:rotate-180
                "
              />
            )}
          </div>
        </TableCell>
      );
    }
  );

   return (
    <div className="h-full flex flex-col flex-1 gap-3">
      {/* Pesquisa */}
      <div className="relative w-full max-w-sm ml-auto">
        <Input
          placeholder={searchPlaceholder ?? "Pesquisar..."}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full pr-9 bg-neutral dark:bg-neutral-900 focus-visible:ring-0"
        />
        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      <div className="rounded-lg border overflow-hidden flex flex-col">
        {/* Header */}
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
                        header.column.getCanSort() && "cursor-pointer select-none",
                        isLast && "text-right pr-4"
                      )}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc" && " ↑"}
                      {header.column.getIsSorted() === "desc" && " ↓"}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
        </Table>

        {/* Body */}
        <ScrollArea className="flex flex-1">
          <Table className="bg-neutral-50 dark:bg-neutral-800 table-fixed border-collapse">
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => {
                  const parent = row.original;
                  const hasChildren =
                    !!children && children.length > 0 && !!childColumns;

                  return hasChildren ? (
                    <Collapsible
                      key={row.id}
                      asChild
                      disabled={!hasChildren}
                    >
                      <>
                        {/* Linha principal */}
                        <CollapsibleTrigger asChild>
                          <TableRow
                            className={cn(
                              'group',
                              'dark:hover:bg-neutral-700',
                              'data-[state=open]:bg-secondary-100',
                              'data-[state=open]:border-2',
                              'data-[state=open]:border-secondary',
                              'data-[state=open]:border-b-0',

                              'data-[state=open]:dark:bg-secondary-900',
                              'data-[state=open]:dark:border-secondary-600',
                              hasChildren && "cursor-pointer",
                          )}>
                            {renderCells(row, hasChildren)}
                          </TableRow>
                        </CollapsibleTrigger>

                        {/* Subtabela */}
                        <CollapsibleContent asChild>
                          <TableRow>
                            <TableCell
                              colSpan={row.getVisibleCells().length}
                              className="p-0"
                            >
                              <div className="-mx-[1px] pl-5 border-2 border-secondary border-t-0 dark:border-secondary-600">
                                <SubTable
                                  data={children}
                                  columns={childColumns(parent)}
                                  parent={parent}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        </CollapsibleContent>
                      </>
                    </Collapsible>
                  ) : (
                    <TableRow key={row.id}>
                      {renderCells(row, hasChildren)}
                    </TableRow>
                  )
                })
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
};

