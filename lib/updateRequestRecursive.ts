import { RequestUpdate } from "@/db/dal/crud-collection";
import { CollectionItem } from "@/db/models.type";

export const updateRequestRecursive = (items: CollectionItem[], requestId: string, updates: RequestUpdate): boolean => {
  for (const item of items) {
    if (item.type === "request") {
      if (item.id === requestId) {
        if (updates.name !== undefined) item.name = updates.name;
        if (updates.method !== undefined) item.method = updates.method;
        return true;
      }
    } else if (updateRequestRecursive(item.items, requestId, updates)) return true;
  }
  return false;
};
