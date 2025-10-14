import { Collection, CollectionItem } from "@/db/models.type";

export const findParent = (collection: Collection, targetId: string): string | undefined => {
  const walk = (items: CollectionItem[], targetId: string, parent: string) => {
    for (const item of items) {
      if (item.id === targetId) return parent;
      if (item.type === "folder" && item.items.length > 0) return walk(item.items, targetId, item.id);
      return undefined;
    }
  };
  if (targetId === collection.id) return "root";
  return walk(collection.items, targetId, collection.id);
};
