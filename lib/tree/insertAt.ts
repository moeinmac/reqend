import { TreeViewItem } from "@/components/TreeView/TreeView";

export const insertAt = (
  items: TreeViewItem[],
  targetId: string | null,
  position: "inside" | "before" | "after",
  node: TreeViewItem
): TreeViewItem[] => {
  if (targetId === null) {
    if (position === "before") return [node, ...items];
    if (position === "after") return [...items, node];
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
        } else if (position === "inside") out.push({ ...it, children: [...(it.children || []), node] });
      } else out.push({ ...it, children: it.children ? parentAware(it.children) : undefined });
    }
    return out;
  };

  return parentAware(items);
};
