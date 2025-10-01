import { TreeViewItem } from "@/components/tree-view";
import { Collection, CollectionItem, Method } from "@/db/models.type";

export const treeToCollection = (tree: TreeViewItem[], collectionCreatedAt?: string): Collection => {
  if (tree.length !== 1 || tree[0].type !== "root") {
    throw new Error("Tree must have a single root node with type 'root'");
  }

  const root = tree[0];

  function transformNode(node: TreeViewItem): CollectionItem {
    if (node.type === "folder") {
      return {
        id: node.id,
        name: node.name,
        type: "folder",
        items: (node.children ?? []).map(transformNode),
      };
    }
    return {
      id: node.id,
      name: node.name,
      type: "request",
      method: node.type as Method,
    };
  }

  return {
    id: root.id,
    name: root.name,
    createdAt: collectionCreatedAt ?? new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    items: (root.children ?? []).map(transformNode),
  };
};
