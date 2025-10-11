"use client";

import { findAndRemove } from "@/lib/tree/findAndRemove";
import { insertAt } from "@/lib/tree/insertAt";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";
import React, { FC, useEffect, useMemo, useState } from "react";
import { CollectionMenu } from "../Collection/CollectionMenu";
import { TreeItem, type TreeViewMenuItem } from "./TreeItem";

export interface TreeViewItem {
  id: string;
  name: string;
  type: string;
  children?: TreeViewItem[];
}

export interface TreeViewIconMap {
  [key: string]: React.ReactNode | undefined;
}

export interface TreeViewProps {
  className?: string;
  data: TreeViewItem[];
  getIcon?: (item: TreeViewItem, depth: number) => React.ReactNode;
  iconMap?: TreeViewIconMap;
  menuItems?: TreeViewMenuItem[];
  onMove?: (newTree: TreeViewItem[], sourceId: string, targetId: string | null, position: "inside" | "before" | "after") => void;
  onSaveRequest?: (item: TreeViewItem) => Promise<void>;
}

export const TreeView: FC<TreeViewProps> = ({ className, data, iconMap, getIcon, onMove, menuItems, onSaveRequest }) => {
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

    onMove?.(newTree, sourceId, targetId, position);
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
    onMove?.(newTree, sourceId, null, "inside");
  };

  const children = treeData[0].children ?? [];

  return (
    <div className="flex gap-4">
      <div className={cn("bg-background p-3 rounded-lg border max-w-2xl space-y-4 w-full relative shadow-lg", className)}>
        <div className={cn("flex items-center justify-between", children.length === 0 && "mb-0")}>
          <h3 className={cn("flex items-center gap-2", onSaveRequest && "cursor-pointer")} onDoubleClick={async () => onSaveRequest?.(treeData[0])}>
            <Package className="w-5 h-5" /> {treeData[0].name}
          </h3>
          <div className="flex items-center gap-0">
            <CollectionMenu menuItems={menuItems ?? []} item={treeData[0]} />
          </div>
        </div>
        <div className="rounded-md relative select-none" onDragOver={handleRootDragOver} onDrop={handleRootDrop}>
          {children.map((item) => (
            <TreeItem
              collectionId={treeData[0].id}
              key={item.id}
              item={item}
              depth={0}
              getIcon={getIcon}
              iconMap={iconMap}
              onDropItem={handleDropItem}
              expandedIds={expandedIds}
              onToggleExpand={toggleExpand}
              menuItems={menuItems}
              onSaveRequest={onSaveRequest}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
