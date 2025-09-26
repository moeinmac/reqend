import { v4 } from "uuid";
import { Collection } from "../models.type";
import { setItem } from "../db";

export const newCollectionHandler = async (name: string) => {
  const newCollection: Collection = {
    createdAt: new Date().toISOString(),
    id: v4(),
    items: [],
    modifiedAt: new Date().toISOString(),
    name,
  };

  await setItem<Collection>(newCollection.id, newCollection);
  return newCollection.id;
};
