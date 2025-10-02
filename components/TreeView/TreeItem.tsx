import { FC, useRef } from "react";
import { TreeViewIconMap, TreeViewItem, TreeViewMenuItem } from "./TreeView";
import { Box, ChevronRight, Folder, FolderOpen } from "lucide-react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";
import { cn } from "@/lib/utils";

const defaultIconMap: TreeViewIconMap = {
  file: <Box className="h-4 w-4 text-red-600" />,
  folder: <Folder className="h-4 w-4 text-primary/80" />,
};

interface TreeItemProps {
  item: TreeViewItem;
  depth?: number;
  getIcon?: (item: TreeViewItem, depth: number) => React.ReactNode;
  iconMap?: TreeViewIconMap;
  onDropItem: (targetId: string | null, position: "inside" | "before" | "after", e: React.DragEvent, targetItem: TreeViewItem) => void;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  menuItems?: TreeViewMenuItem[];
}

export const TreeItem: FC<TreeItemProps> = ({
  item,
  depth = 0,
  getIcon,
  iconMap = defaultIconMap,
  onDropItem,
  expandedIds,
  onToggleExpand,
  menuItems,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const isFolder = Boolean(item.children && item.children.length > 0);
  const isOpen = expandedIds.has(item.id);

  const renderIcon = (isFolder: boolean, isOpen: boolean) => {
    if (getIcon) return getIcon(item, depth);
    if (isFolder) return isOpen ? <FolderOpen className="h-4 w-4 text-primary/80" /> : <Folder className="h-4 w-4 text-primary/80" />;
    return iconMap[item.type] || iconMap.folder || defaultIconMap.folder;
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData("text/plain", item.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const third = rect.height / 3;
    let position: "inside" | "before" | "after" = "inside";

    if (relativeY < third) position = "before";
    else if (relativeY > rect.height - third) position = "after";
    else position = "inside";

    onDropItem(item.id, position, e, item);
  };

  const handleToggle = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!isFolder) return;

    onToggleExpand(item.id);
  };

  return (
    <ContextMenu modal={false}>
      <ContextMenuTrigger>
        <div>
          <div
            ref={itemRef}
            data-tree-item
            data-id={item.id}
            data-depth={depth}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleToggle}
            className={"select-none cursor-pointer text-foreground px-1"}
            style={{ paddingLeft: `${depth * 20}px` }}
          >
            <div className="flex items-center h-8 gap-2">
              {isFolder ? (
                <button type="button" onClick={handleToggle} className="h-6 w-6 flex items-center justify-center" aria-expanded={isOpen}>
                  <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
                </button>
              ) : (
                <div className="h-6 w-6" />
              )}

              {renderIcon(isFolder, isOpen)}
              <span className="flex-1">{item.name} </span>
            </div>
          </div>

          {isFolder && isOpen && (
            <div>
              {item.children?.map((child) => (
                <TreeItem
                  key={child.id}
                  item={child}
                  depth={depth + 1}
                  getIcon={getIcon}
                  iconMap={iconMap}
                  onDropItem={onDropItem}
                  expandedIds={expandedIds}
                  onToggleExpand={onToggleExpand}
                  menuItems={menuItems}
                />
              ))}
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent style={{ width: "200px" }}>
        {menuItems?.map((mi) => (
          <ContextMenuItem key={mi.id} onClick={() => mi.action(item)}>
            {mi.icon && <span className="mr-2 h-4 w-4">{mi.icon}</span>}
            {mi.label}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
};
