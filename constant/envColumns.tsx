import { ColumnDef } from "@tanstack/react-table";
import { BsTrash } from "react-icons/bs";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { EnvironmentItem } from "@/db/models.type";
import { useEffect, useState } from "react";

export const defaultColumn: Partial<ColumnDef<EnvironmentItem>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => setValue(initialValue), [initialValue]);
    return <Input value={value as string} onChange={(e) => setValue(e.target.value)} onBlur={onBlur} />;
  },
};

export const envColumns: ColumnDef<EnvironmentItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "variable",
    header: "Variable Name",
    enableHiding: false,
    footer: (props) => props.column.id,
    size: 30,
  },
  {
    accessorKey: "value",
    header: "Value",
    footer: (props) => props.column.id,
    size: 70, // 2/3 of the width
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table, cell }) => {
      return (
        <div className="items-end flex-col flex">
          <Button
            variant={"ghost"}
            className="cursor-pointer"
            onClick={() => {
              table.options.meta?.deleteRow(+row.id, cell.id);
            }}
          >
            <BsTrash />
          </Button>
        </div>
      );
    },
  },
];
