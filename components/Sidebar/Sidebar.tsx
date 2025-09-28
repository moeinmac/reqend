"use client";

import { folderTreeGenerator, temp } from "@/lib/folderTreeGenerator";
import { PackagePlus } from "lucide-react";
import { FC } from "react";
import Collection from "../Collection/Collection";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Demo from "./Demo";
const Sidebar: FC = () => {
  return (
    <div className="col-span-2 p-4">
      <div className="flex items-center gap-4">
        <h3 className="font-bold">Collections</h3>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="link" size={"icon"}>
              <PackagePlus />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>New Collection</p>
          </TooltipContent>
        </Tooltip>

        <Button
          size={"xs"}
          variant={"secondary"}
          onClick={async () =>
            // await newFolderHandler({
            //   collectionId: "002cfefc-8d21-4dae-a01d-c38c11e531ef",
            //   folderName: "this",
            //   targetId: "002cfefc-8d21-4dae-a01d-c38c11e531ef",
            // })
            {
              const tree = folderTreeGenerator(temp);
              console.log(tree);
            }
          }
        >
          New Folder
        </Button>
      </div>
      {/* <Collection />     */}
      <Demo />
    </div>
  );
};

export default Sidebar;
