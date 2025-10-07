import { SaveRequestInput } from "@/db/dal/crud-collection";
import type { CollectionItem, RequestPrimary } from "@/db/models.type";

export const saveRequestRecursive = (items: CollectionItem[], input: SaveRequestInput): CollectionItem[] => {
  for (const item of items) {
    if (item.type === "request") continue;
    if (item.id === input.targetId) {
      const newRequest: RequestPrimary = {
        id: input.requestPrimary.id,
        name: input.requestPrimary.name,
        method: input.requestPrimary.method,
        type: "request",
      };
      item.items.unshift(newRequest);
      return items;
    }

    if (item.items && item.items.length > 0) {
      const result = saveRequestRecursive(item.items, input);
      if (result) return items;
    }
  }
  return items;
};
