import { v4 } from "uuid";
import { Collection, FolderItem } from "../models.type";
import { getItem, removeItem, setItem } from "../db";
import { newFolderRecursive } from "@/lib/newFolderRecursive";

export const newCollectionHandler = async (name: string) => {
  const newCollection: Collection = {
    createdAt: new Date().toISOString(),
    id: v4(),
    items: [],
    modifiedAt: new Date().toISOString(),
    name,
  };

  await setItem<Collection>("collection", newCollection.id, newCollection);
  return newCollection;
};

export interface NewFolderInput {
  collectionId: string;
  folderName: string;
  targetId: string;
}

export const newFolderHandler = async (input: NewFolderInput): Promise<Collection | undefined> => {
  const thisCollection = await getItem<Collection>("collection", input.collectionId);
  if (!thisCollection) return undefined;
  if (input.collectionId === input.targetId) {
    const newFolder: FolderItem = {
      id: v4(),
      items: [],
      name: input.folderName,
      type: "folder",
    };
    thisCollection.items.unshift(newFolder);
    await setItem<Collection>("collection", input.collectionId, thisCollection);
    return thisCollection;
  }
  const newItems = newFolderRecursive(thisCollection.items, input);
  const newCollection: Collection = {
    createdAt: thisCollection.createdAt,
    id: thisCollection.id,
    items: newItems,
    modifiedAt: new Date().toISOString(),
    name: thisCollection.name,
  };
  await setItem<Collection>("collection", input.collectionId, newCollection);
  return newCollection;
};

export const draggedCollectionHandler = async (draggedCollection: Collection) => {
  await setItem<Collection>("collection", draggedCollection.id, draggedCollection);
  return draggedCollection;
};

export const removeCollectionHandler = async (collectionId: string) => {
  await removeItem("collection", collectionId);
};
