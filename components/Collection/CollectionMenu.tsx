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
import { FC, Fragment } from "react";
import { TreeViewMenuItem } from "../TreeView/TreeItem";
import { TreeViewItem } from "../TreeView/TreeView";
import { ContextMenuSeparator } from "../ui/context-menu";

interface CollectionMenuProps {
  menuItems: TreeViewMenuItem[];
  item: TreeViewItem;
}

export const CollectionMenu: FC<CollectionMenuProps> = ({ menuItems, item }) => {
  const collectionMenuItems = menuItems.filter((mi) => mi.type.includes("collection"));
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button size={"xs"} variant="link">
          <EllipsisVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        {collectionMenuItems.map((mi, index) => (
          <Fragment key={mi.id}>
            <DropdownMenuItem inset key={mi.id} onClick={() => mi.action(item)}>
              {mi.icon && <span className="mr-2 h-4 w-4">{mi.icon}</span>}
              {mi.label}
              {mi.shortcut && <DropdownMenuShortcut>{mi.shortcut}</DropdownMenuShortcut>}
            </DropdownMenuItem>
            {mi.separator && index !== collectionMenuItems.length - 1 && <ContextMenuSeparator />}
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
