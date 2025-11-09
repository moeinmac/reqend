"use client";

import {
  RowSelectionState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEnvStore } from "@/store/useEnvStore";
import { FC, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { envColumns, defaultColumn } from "@/constant/envColumns";
import { Card } from "../ui/card";

const EnvTable: FC = () => {
  const { activeEnvId, addNewEnvItem, deleteEnvItem, updateEnvItems, updateSelectItem, envs } = useEnvStore(
    useShallow((state) => ({
      activeEnvId: state.activeEnvId,
      addNewEnvItem: state.addNewEnvItem,
      updateEnvItems: state.updateEnvItems,
      deleteEnvItem: state.deleteEnvItem,
      updateSelectItem: state.updateSelectItem,
      envs: state.envs,
    }))
  );
  const thisEnv = envs.find((env) => env.id === activeEnvId);
  if (!thisEnv) return;
  const data = thisEnv.items;
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const addNewEnvHandler = async () => await addNewEnvItem();

  const rowSelection = useMemo(() => {
    if (!activeEnvId) return {};
    return thisEnv.items.reduce((acc, item, index) => {
      if (item.selected) {
        acc[index] = true;
      }
      return acc;
    }, {} as RowSelectionState);
  }, [envs]);

  const table = useReactTable({
    defaultColumn,
    data,
    columns: envColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: updateSelectItem,
    state: {
      columnVisibility,
      rowSelection,
    },
    meta: {
      updateData: async (rowIndex, columnId, value) => {
        return await updateEnvItems(rowIndex, columnId, value);
      },
      deleteRow: async (rowIndex) => {
        const thisRow = table.getRow(`${rowIndex}`);
        await deleteEnvItem(thisRow.original.id);
      },
    },
  });

  return (
    <Card className="px-4 w-full">
      <div className="flex items-center py-4">
        <Button size={"sm"} className="cursor-pointer" disabled={data.length > 0 && data[data.length - 1].variable === ""} onClick={addNewEnvHandler}>
          Add New Variable
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"sm"} variant="secondary" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead style={{ width: header.id === "select" ? "25px" : header.getSize() + "%" }} key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={envColumns.length} className="h-24 text-center">
                  No Variable Found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div>
    </Card>
  );
};

export default EnvTable;
