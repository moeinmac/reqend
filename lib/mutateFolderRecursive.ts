import { type MutateFolderInput } from "@/db/dal/crud-collection";
import type { CollectionItem, FolderItem } from "@/db/models.type";
import { v4 } from "uuid";

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
