"use client";

import { FC } from "react";
import { Button } from "../ui/button";
import Collection from "../Collection/Collection";

const Sidebar: FC = () => {
  return (
    <div className="col-span-2 p-4">
      <div className="flex items-center gap-4">
        <h3 className="font-bold">Collections</h3>
        <Button size={"xs"} variant={"secondary"}>
          New Collection
        </Button>
      </div>
      <Collection />
    </div>
  );
};

export default Sidebar;
