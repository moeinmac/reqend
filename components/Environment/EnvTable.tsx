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
import { defaultColumn, paramsColumns } from "@/constant/paramsColumns";
import { useRequestStore } from "@/store/useRequestStore";
import { FC, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

const EnvTable: FC = () => {
  const { request, addNewParam, updateParams, deleteParam, updateSelectParam } = useRequestStore(
    useShallow((state) => ({
      request: state.request,
      addNewParam: state.addNewParam,
      updateParams: state.updateParams,
      deleteParam: state.deleteParam,
      updateSelectParam: state.updateSelectParam,
    }))
  );
  const data = request ? request.params : [];
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const addNewParamHandler = async () => await addNewParam();

  const rowSelection = useMemo(() => {
    if (!request) return {};
    return request.params.reduce((acc, param, index) => {
      if (param.selected) {
        acc[index] = true;
      }
      return acc;
    }, {} as RowSelectionState);
  }, [request]);

  const table = useReactTable({
    defaultColumn,
    data,
    columns: paramsColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: updateSelectParam,
    state: {
      columnVisibility,
      rowSelection,
    },
    meta: {
      updateData: async (rowIndex, columnId, value) => {
        return await updateParams(rowIndex, columnId, value);
      },
      deleteRow: async (rowIndex) => {
        const thisRow = table.getRow(`${rowIndex}`);
        await deleteParam(thisRow.original.id);
      },
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Button size={"sm"} className="cursor-pointer" disabled={data.length > 0 && data[data.length - 1].key === ""} onClick={addNewParamHandler}>
          Add Param
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
                    <TableHead key={header.id}>
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
                <TableCell colSpan={paramsColumns.length} className="h-24 text-center">
                  No Params Detected.
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
    </div>
  );
};

export default EnvTable;
