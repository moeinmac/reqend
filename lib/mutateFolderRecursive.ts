import { type MutateFolderInput } from "@/db/dal/crud-collection";
import type { CollectionItem, FolderItem, Collection } from "@/db/models.type";
import { v4 } from "uuid";

export const fixTargetId = (collection: Collection, targetId: string): string | undefined => {
  const walk = (items: CollectionItem[], targetId: string, parent: string) => {
    for (const item of items) {
      if (item.id === targetId) return item.type === "folder" ? item.id : parent;
      if (item.type === "folder" && item.items.length > 0) return walk(item.items, targetId, item.id);
      return undefined;
    }
  };
  if (targetId === collection.id) return "root";
  return walk(collection.items, targetId, collection.id);
};

export const newFolderRecursive = (items: CollectionItem[], input: MutateFolderInput): CollectionItem[] => {
  for (const item of items) {
    if (item.type === "request") continue;
    if (item.id === input.targetId) {
      const newFolder: FolderItem = {
        id: v4(),
        items: [],
        name: input.folderName,
        type: "folder",
      };
      item.items.unshift(newFolder);
      return items;
    }

    if (item.items && item.items.length > 0) {
      const result = newFolderRecursive(item.items, input);
      if (result) return items;
    }
  }
  return items;
};

export const renameFolderRecursive = (items: CollectionItem[], input: MutateFolderInput): CollectionItem[] => {
  for (const item of items) {
    if (item.type === "request") continue;
    if (item.id === input.targetId) {
      item.name = input.folderName;
      return items;
    }

    if (item.items && item.items.length > 0) {
      const result = renameFolderRecursive(item.items, input);
      if (result) return items;
    }
  }
  return items;
};
