import { TreeViewItem } from "@/components/tree-view";
import { Collection, CollectionItem, FolderItem, RequestPrimary } from "@/db/models.type";

export const collectionToTree = (collection: Collection): TreeViewItem[] => {
  const convertItem = (item: CollectionItem): TreeViewItem => {
    if (item.type === "folder") {
      const folder = item as FolderItem;
      return {
        id: folder.id,
        name: folder.name,
        type: "folder",
        children: folder.items ? folder.items.map(convertItem) : [],
      };
    } else {
      const req = item as RequestPrimary;
      return {
        id: req.id,
        name: req.name,
        type: req.method,
      };
    }
  };

  const root: TreeViewItem = {
    id: collection.id,
    name: collection.name,
    type: "root",
    children: collection.items ? collection.items.map(convertItem) : [],
  };

  return [root];
};
