import { TreeViewItem } from "@/components/TreeView/TreeView";

export const findAndRemove = (items: TreeViewItem[], id: string): { item: TreeViewItem | null; newTree: TreeViewItem[] } => {
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
