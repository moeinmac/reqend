"use client";

import { useCollectionStore } from "@/store/useCollectionStore";
import { FC, useEffect } from "react";
import CollectionWrapper from "../Collection/CollectionWrapper";
import MutateCollection from "../Collection/MutateCollection";
import { cn } from "@/lib/utils";

interface SidebarProps {
  mode: "sidebar" | "treeview";
}

const Sidebar: FC<SidebarProps> = ({ mode }) => {
  const collections = useCollectionStore((state) => state.collections);
  const fetchAllCollections = useCollectionStore((state) => state.fetchAllCollections);

  useEffect(() => {
    fetchAllCollections();
  }, []);

  return (
    <div className={cn(mode === "sidebar" && "col-span-2 p-4")}>
      {mode === "sidebar" && (
        <div className="flex items-center gap-4 mb-3">
          <h3 className="font-bold">Collections</h3>
          <MutateCollection mode="new" />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {collections.map((collection) => (
          <CollectionWrapper data={collection} key={collection.id} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
