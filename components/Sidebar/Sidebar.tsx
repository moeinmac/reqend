"use client";

import { useCollectionStore } from "@/store/useCollectionStore";
import { FC, useEffect } from "react";
import CollectionWrapper from "../Collection/CollectionWrapper";
import MutateCollection from "../Collection/MutateCollection";
import { cn } from "@/lib/utils";
import { useShallow } from "zustand/react/shallow";

interface SidebarProps {
  mode: "sidebar" | "treeview";
}

const Sidebar: FC<SidebarProps> = ({ mode }) => {
  const { collections, fetchAllCollections } = useCollectionStore(
    useShallow((state) => ({ collections: state.collections, fetchAllCollections: state.fetchAllCollections }))
  );

  useEffect(() => {
    fetchAllCollections();
  }, [fetchAllCollections]);

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
          <CollectionWrapper data={collection} key={collection.id} mode={mode} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
