import { newFolderRecursive, renameFolderRecursive } from "@/lib/mutateFolderRecursive";
import { saveRequestRecursive } from "@/lib/saveRequestRecursive";
import { updateRequestRecursive } from "@/lib/updateRequestRecursive";
import { v4 } from "uuid";
import { getItem, removeItem, setItem } from "../db";
import { Collection, FolderItem, Method, RequestPrimary } from "../models.type";

export interface MutateFolderInput {
  collectionId: string;
  folderName: string;
  targetId: string;
}

export interface SaveRequestInput {
  collectionId: string;
  requestPrimary: RequestPrimary;
  targetId: string;
}

export interface RequestUpdate {
  name?: string;
  method?: Method;
}

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

export const newFolderHandler = async (input: MutateFolderInput): Promise<Collection | undefined> => {
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

export const renameFolderHandler = async (input: MutateFolderInput): Promise<Collection | undefined> => {
  const thisCollection = await getItem<Collection>("collection", input.collectionId);
  if (!thisCollection) return undefined;
  if (input.collectionId === input.targetId) return undefined;

  const newItems = renameFolderRecursive(thisCollection.items, input);
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

export const renameCollectionHandler = async (collectionId: string, newName: string) => {
  const collection = await getItem<Collection>("collection", collectionId);
  if (collection) {
    const newCollection: Collection = {
      ...collection,
      name: newName,
    };
    await setItem<Collection>("collection", collectionId, newCollection);
    return newCollection;
  }
};

export const saveRequestHandler = async (input: SaveRequestInput): Promise<Collection | undefined> => {
  const thisCollection = await getItem<Collection>("collection", input.collectionId);
  if (!thisCollection) return undefined;
  if (input.collectionId === input.targetId) {
    const newRequest: RequestPrimary = {
      id: input.requestPrimary.id,
      name: input.requestPrimary.name,
      method: input.requestPrimary.method,
      type: "request",
    };
    thisCollection.items.unshift(newRequest);
    await setItem<Collection>("collection", input.collectionId, thisCollection);
    return thisCollection;
  }
  const newItems = saveRequestRecursive(thisCollection.items, input);
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

export const updateRequestInCollection = async (collectionId: string, requestId: string, updates: RequestUpdate): Promise<false | Collection> => {
  if (!collectionId || !requestId || !updates || (updates.name === undefined && updates.method === undefined)) return false;
  const collection = await getItem<Collection>("collection", collectionId);
  if (!collection) return false;
  if (!updateRequestRecursive(collection.items, requestId, updates)) return false;
  collection.modifiedAt = new Date().toISOString();
  await setItem("collection", collectionId, collection);
  return collection;
};
