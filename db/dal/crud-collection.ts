import { v4 } from "uuid";
import { Collection, FolderItem } from "../models.type";
import { getItem, setItem } from "../db";

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

interface NewFolderInput {
  collectionId: string;
  folderName: string;
  targetId: string;
  position: "next" | "below";
}
export const newFolderHandler = async ({ collectionId, folderName, position, targetId }: NewFolderInput) => {
  const thisCollection = await getItem<Collection>("collection", collectionId);
  if (!thisCollection) return;
  if (collectionId === targetId) {
    const newFolder: FolderItem = {
      id: v4(),
      items: [],
      name: folderName,
      type: "folder",
    };
    thisCollection.items.unshift(newFolder);
    await setItem<Collection>("collection", collectionId, thisCollection);
    return;
  }
  // thisCollection.items.forEach((colItem) => {
  //   if (colItem.type === "request") return;
  // });
};
