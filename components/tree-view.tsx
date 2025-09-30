"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Folder, Box, ChevronRight, FolderOpen, FolderDot, FolderOpenDot } from "lucide-react";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";

export interface TreeViewItem {
  id: string;
  name: string;
  type: string; // "file" | "folder"
  children?: TreeViewItem[];
}

export interface TreeViewIconMap {
  [key: string]: React.ReactNode | undefined;
}

export interface TreeViewMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action: (item: TreeViewItem) => void;
}

export interface TreeViewProps {
  className?: string;
  data: TreeViewItem[];
  getIcon?: (item: TreeViewItem, depth: number) => React.ReactNode;
  iconMap?: TreeViewIconMap;
  menuItems?: TreeViewMenuItem[];
  /**
   * Called when an item was moved via drag & drop.
   * sourceId: id of dragged item
   * targetId: id of drop target (null if dropped to root)
   * position: "inside" | "before" | "after"
   * newTree: the updated tree data
   */
  onMove?: (sourceId: string, targetId: string | null, position: "inside" | "before" | "after", newTree: TreeViewItem[]) => void;
}

const defaultIconMap: TreeViewIconMap = {
  file: <Box className="h-4 w-4 text-red-600" />,
  folder: <Folder className="h-4 w-4 text-primary/80" />,
};

const findAndRemove = (items: TreeViewItem[], id: string): { item: TreeViewItem | null; newTree: TreeViewItem[] } => {
  let removed: TreeViewItem | null = null;
  const walk = (list: TreeViewItem[]): TreeViewItem[] => {
    return list
      .map((it) => ({ ...it }))
      .filter((it) => {
        if (it.id === id) {
          removed = it;
          return false;
        }
        if (it.children) {
          it.children = walk(it.children);
        }
        return true;
      });
  };
  const newTree = walk(items);
  return { item: removed, newTree };
};

const insertAt = (items: TreeViewItem[], targetId: string | null, position: "inside" | "before" | "after", node: TreeViewItem): TreeViewItem[] => {
  if (targetId === null) {
    // drop to root
    if (position === "before") return [node, ...items];
    if (position === "after") return [...items, node];
    // inside -> append
    return [...items, node];
  }

  const parentAware = (list: TreeViewItem[]): TreeViewItem[] => {
    const out: TreeViewItem[] = [];
    for (let i = 0; i < list.length; i++) {
      const it = list[i];
      if (it.id === targetId) {
        if (position === "before") {
          out.push(node);
          out.push({ ...it, children: it.children ? parentAware(it.children) : undefined });
        } else if (position === "after") {
          out.push({ ...it, children: it.children ? parentAware(it.children) : undefined });
          out.push(node);
        } else if (position === "inside") {
          out.push({ ...it, children: [...(it.children || []), node] });
        }
      } else {
        out.push({ ...it, children: it.children ? parentAware(it.children) : undefined });
      }
    }
    return out;
  };

  return parentAware(items);
};

function TreeItemComponent({
  item,
  depth = 0,
  getIcon,
  iconMap = defaultIconMap,
  onDropItem,
  expandedIds,
  onToggleExpand,
  menuItems,
}: {
  item: TreeViewItem;
  depth?: number;
  getIcon?: (item: TreeViewItem, depth: number) => React.ReactNode;
  iconMap?: TreeViewIconMap;
  onDropItem: (targetId: string | null, position: "inside" | "before" | "after", e: React.DragEvent, targetItem: TreeViewItem) => void;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  menuItems?: TreeViewMenuItem[];
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const isFolder = Boolean(item.children && item.children.length > 0);
  const isOpen = expandedIds.has(item.id);

  const renderIcon = (isFolder: boolean, isOpen: boolean) => {
    if (getIcon) return getIcon(item, depth);
    if (item.type === "root")
      return isOpen ? <FolderOpenDot className="h-4 w-4 text-primary/80" /> : <FolderDot className="h-4 w-4 text-primary/80" />;
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
    <ContextMenu>
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
                <TreeItemComponent
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
      <ContextMenuContent>
        {menuItems?.map((mi) => (
          <ContextMenuItem key={mi.id} onClick={() => mi.action(item)}>
            {mi.icon && <span className="mr-2 h-4 w-4">{mi.icon}</span>}
            {mi.label}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default function TreeView({ className, data, iconMap, getIcon, onMove, menuItems }: TreeViewProps) {
  const [treeData, setTreeData] = useState<TreeViewItem[]>(data);
  useEffect(() => setTreeData(data), [data]);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const itemMap = useMemo(() => {
    const map = new Map<string, TreeViewItem>();
    const walk = (it: TreeViewItem) => {
      map.set(it.id, it);
      it.children?.forEach(walk);
    };
    treeData.forEach(walk);
    return map;
  }, [treeData]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isDescendant = (parentId: string, childId: string | null): boolean => {
    if (!childId) return false;
    const parent = itemMap.get(parentId);
    if (!parent || !parent.children) return false;
    if (parent.children.some((c) => c.id === childId)) return true;
    return parent.children.some((c) => isDescendant(c.id, childId));
  };

  const handleDropItem = (targetId: string | null, position: "inside" | "before" | "after", e: React.DragEvent, targetItem?: TreeViewItem) => {
    const sourceId = e.dataTransfer.getData("text/plain");
    if (!sourceId || sourceId === targetId) return;

    if (isDescendant(sourceId, targetId)) return;

    const { item: movingNode, newTree: treeWithout } = findAndRemove(treeData, sourceId);
    if (!movingNode) return;

    const newTree = insertAt(treeWithout, targetId, position, movingNode);
    setTreeData(newTree);

    // if dropped inside a folder, expand it so user sees the moved item
    if (position === "inside" && targetId) setExpandedIds((s) => new Set(s).add(targetId));

    onMove?.(sourceId, targetId, position, newTree);
  };

  const handleRootDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRootDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain");
    if (!sourceId) return;
    if (sourceId === null) return;

    const { item: movingNode, newTree: treeWithout } = findAndRemove(treeData, sourceId);
    if (!movingNode) return;

    const newTree = insertAt(treeWithout, null, "inside", movingNode);
    setTreeData(newTree);
    onMove?.(sourceId, null, "inside", newTree);
  };

  return (
    <div className="flex gap-4">
      <div className={cn("bg-background p-3 rounded-xl border max-w-2xl space-y-4 w-[600px] relative shadow-lg", className)}>
        <div className="rounded-lg relative select-none" onDragOver={handleRootDragOver} onDrop={handleRootDrop}>
          {treeData.map((item) => (
            <TreeItemComponent
              key={item.id}
              item={item}
              depth={0}
              getIcon={getIcon}
              iconMap={iconMap}
              onDropItem={handleDropItem}
              expandedIds={expandedIds}
              onToggleExpand={toggleExpand}
              menuItems={menuItems}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
