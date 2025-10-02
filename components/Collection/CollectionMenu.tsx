import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { FC } from "react";
import { TreeViewMenuItem } from "../TreeView/TreeItem";
import { TreeViewItem } from "../TreeView/TreeView";
import { ContextMenuSeparator } from "../ui/context-menu";

interface CollectionMenuProps {
  menuItems: TreeViewMenuItem[];
  item: TreeViewItem;
}

export const CollectionMenu: FC<CollectionMenuProps> = ({ menuItems, item }) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button size={"xs"} variant="link">
          <EllipsisVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        {menuItems?.map((mi) =>
          mi.type.includes("collection") ? (
            <>
              <DropdownMenuItem inset key={mi.id} onClick={() => mi.action(item)}>
                {mi.icon && <span className="mr-2 h-4 w-4">{mi.icon}</span>}
                {mi.label}
                {mi.shortcut && <DropdownMenuShortcut>{mi.shortcut}</DropdownMenuShortcut>}
              </DropdownMenuItem>
              {mi.separator && <ContextMenuSeparator />}
            </>
          ) : null
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
