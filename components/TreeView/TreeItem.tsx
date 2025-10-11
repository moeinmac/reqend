import { cn } from "@/lib/utils";
import { ContextMenuSeparator } from "@radix-ui/react-context-menu";
import { ChevronRight, Folder, FolderOpen } from "lucide-react";
import { FC, Fragment, MouseEvent, useRef } from "react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuShortcut, ContextMenuTrigger } from "../ui/context-menu";
import { TreeViewIconMap, TreeViewItem } from "./TreeView";
import { useEventHandler } from "@/hooks/useEventHandler";
import { useRequestStore } from "@/store/useRequestStore";
import { useCollectionStore } from "@/store/useCollectionStore";
import { useShallow } from "zustand/react/shallow";
import { useActiveReqStore } from "@/store/useActiveReqStore";
import { Method } from "@/db/models.type";

const defaultIconMap: TreeViewIconMap = {
  folder: <Folder className="h-4 w-4 text-primary/80" />,
};

export interface TreeViewMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  separator?: true;
  type: ("folder" | "request" | "collection")[];
  action: (item: TreeViewItem) => void;
}

interface TreeItemProps {
  item: TreeViewItem;
  depth?: number;
  getIcon?: (item: TreeViewItem, depth: number) => React.ReactNode;
  iconMap?: TreeViewIconMap;
  onDropItem: (targetId: string | null, position: "inside" | "before" | "after", e: React.DragEvent, targetItem: TreeViewItem) => void;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  menuItems?: TreeViewMenuItem[];
  onSaveRequest?: (item: TreeViewItem) => Promise<void>;
  collectionId: string;
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
  onSaveRequest,
  collectionId,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const isFolder = Boolean(item.children && item.children.length > 0);
  const isOpen = expandedIds.has(item.id);
  const itemType = isFolder ? "folder" : "request";

  const addActiveReq = useShallow(useActiveReqStore((state) => state.add));

  const renderIcon = (isFolder: boolean, isOpen: boolean) => {
    if (getIcon) return getIcon(item, depth);
    if (isFolder) return isOpen ? <FolderOpen className="h-4 w-4 text-primary/80" /> : <Folder className="h-4 w-4 text-primary/80" />;
    return iconMap[item.type];
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

  const handleToggle = (e: MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isFolder) addActiveReq({ id: item.id, collectionId, method: item.type as Method, name: item.name, type: "request" });

    onToggleExpand(item.id);
  };

  const handleSaveRequest = async () => {
    if (onSaveRequest) await onSaveRequest(item);
  };

  const { clickHandler, doubleClickHandler } = useEventHandler({
    onClick: handleToggle,
    onDoubleClick: handleSaveRequest,
  });
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
            onClick={clickHandler}
            onDoubleClick={doubleClickHandler}
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
                  onSaveRequest={onSaveRequest}
                  collectionId={collectionId}
                />
              ))}
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {menuItems?.map((mi) =>
          mi.type.includes(itemType) ? (
            <Fragment key={mi.id}>
              <ContextMenuItem inset key={mi.id} onClick={() => mi.action(item)}>
                {mi.icon && <span className="mr-2 h-4 w-4">{mi.icon}</span>}
                {mi.label}
                {mi.shortcut && <ContextMenuShortcut>{mi.shortcut}</ContextMenuShortcut>}
              </ContextMenuItem>
              {mi.separator && <ContextMenuSeparator />}
            </Fragment>
          ) : null
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};
