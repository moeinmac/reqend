"use client";

import { FC } from "react";
import { Button } from "../ui/button";
import Collection from "../Collection/Collection";
import { newCollectionHandler, newFolderHandler } from "@/db/dal/crud-collection";

const Sidebar: FC = () => {
  return (
    <div className="col-span-2 p-4">
      <div className="flex items-center gap-4">
        <h3 className="font-bold">Collections</h3>
        <Button size={"xs"} variant={"secondary"} onClick={async () => await newCollectionHandler("moein")}>
          New Collection
        </Button>
        <Button
          size={"xs"}
          variant={"secondary"}
          onClick={async () =>
            await newFolderHandler({
              collectionId: "002cfefc-8d21-4dae-a01d-c38c11e531ef",
              folderName: "this",
              position: "below",
              targetId: "002cfefc-8d21-4dae-a01d-c38c11e531ef",
            })
          }
        >
          New Folder
        </Button>
      </div>
      <Collection />
    </div>
  );
};

export default Sidebar;
