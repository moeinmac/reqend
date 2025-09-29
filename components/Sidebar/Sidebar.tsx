"use client";

import { PackagePlus } from "lucide-react";
import { FC } from "react";
import Collection from "../Collection/Collection";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import NewCollection from "../Collection/NewCollection";
const Sidebar: FC = () => {
  return (
    <div className="col-span-2 p-4">
      <div className="flex items-center gap-4">
        <h3 className="font-bold">Collections</h3>

        <NewCollection />

        <Button
          size={"xs"}
          variant={"secondary"}
          onClick={async () =>
            // await newFolderHandler({
            //   collectionId: "002cfefc-8d21-4dae-a01d-c38c11e531ef",
            //   folderName: "this",
            //   targetId: "002cfefc-8d21-4dae-a01d-c38c11e531ef",
            // })
            {}
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
