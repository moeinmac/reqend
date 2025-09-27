import { TreeViewElement } from "@/components/ui/file-tree";
import { Collection, CollectionItem } from "@/db/models.type";

export const folderTreeGenerator = (collection: Collection): TreeViewElement => {
  const mapItem = (item: CollectionItem): TreeViewElement => {
    if (item.type === "request") {
      return {
        id: item.id,
        name: item.name,
        isSelectable: true,
      };
    }
    return {
      id: item.id,
      name: item.name,
      children: item.items.map(mapItem),
    };
  };
  return {
    id: "root",
    name: collection.name,
    isSelectable: false,
    children: collection.items.map(mapItem),
  };
};

export const temp: Collection = {
  createdAt: "2025-09-26T19:14:47.767Z",
  id: "002cfefc-8d21-4dae-a01d-c38c11e531ef",
  items: [
    {
      id: "56569940-be4d-4ecc-bf31-4dd39d25a25e",
      items: [],
      name: "not root",
      type: "folder",
    },
    {
      id: "93564c32-dc8c-4fce-b09a-9a168784548a",
      items: [],
      name: "boot",
      type: "folder",
    },
    {
      id: "a6ef6aa0-0fb3-4d56-9f69-6be7fcb49914",
      items: [
        {
          id: "9e9145c0-1ae0-42da-bc8a-f02310744b6d",
          items: [],
          name: "toot toot",
          type: "folder",
        },
        {
          id: "e4405cc3-d340-49b0-9e67-626ad4da381b",
          items: [
            {
              id: "55a7ccc2-769f-4fda-95a8-f69d1198d437",
              items: [{ type: "request", id: "55a7ccc2-769f-4fda-95a8-f69d1198d321", method: "post", name: "rest" }],
              name: "coot coot",
              type: "folder",
            },
          ],
          name: "that is",
          type: "folder",
        },
      ],
      name: "the",
      type: "folder",
    },
  ],
  modifiedAt: "2025-09-26T19:14:47.768Z",
  name: "moein",
};
