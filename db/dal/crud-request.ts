import { v4 } from "uuid";
import { Collection, Request } from "../models.type";
import { getItem, setItem } from "../db";

export const newRequestHandler = async (newReq: Omit<Request, "id">, collectionId: string) => {
  const newRequest: Request = {
    ...newReq,
    id: v4(),
  };
  const thisCollection = await getItem<Collection>(collectionId);
  if (thisCollection) {
    thisCollection.items.push(newRequest);
    await setItem<Collection>(collectionId, thisCollection);
    return newRequest.id;
  }
  // TODO handle errors better
  console.error("could not find this collection");
};
