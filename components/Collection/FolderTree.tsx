import { Collection, CollectionItem } from "@/db/models.type";
import { FC } from "react";
import { File, Folder } from "../ui/file-tree";
import { RequestItem } from "./RequestItem";

interface FolderTreeProps {
  collection: Collection;
}

export const FolderTree: FC<FolderTreeProps> = ({ collection }) => {
  const renderItems = (items: CollectionItem[]) => {
    return items.map((item) => {
      if (item.type === "request") {
        return (
          <File key={item.id} value={item.id}>
            <RequestItem item={item} />
          </File>
        );
      }

      return (
        <Folder key={item.id} value={item.id} element={item.name}>
          {item.items && item.items.length > 0 ? renderItems(item.items) : null}
        </Folder>
      );
    });
  };

  return (
    <Folder value="root" element={collection.name}>
      {renderItems(collection.items)}
    </Folder>
  );
};
