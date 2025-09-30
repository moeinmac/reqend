"use client";

import { FC, useEffect, useState } from "react";
import CollectionWrapper from "../Collection/CollectionWrapper";
import NewCollection from "../Collection/NewCollection";
import { getAllItems } from "@/db/db";
import { Collection } from "@/db/models.type";
import { collectionToTree } from "@/lib/collectionToTree";

const Sidebar: FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      const allCollections = await getAllItems<Collection>("collection");
      if (allCollections) setCollections(allCollections);
    };
    fetchCollections();
  }, []);

  console.log(collections, "collections");

  const onNewCollectionHandler = (newCollection: Collection) => setCollections((prev) => [newCollection, ...prev]);
  const onNewFolderHandler = async () => {
    const allCollections = await getAllItems<Collection>("collection");
    if (allCollections) setCollections(allCollections);
  };
  return (
    <div className="col-span-2 p-4">
      <div className="flex items-center gap-4">
        <h3 className="font-bold">Collections</h3>
        <NewCollection onNewCollection={onNewCollectionHandler} />
      </div>
      <div className="flex flex-col gap-3">
        {collections.map((collection) => (
          <CollectionWrapper data={collectionToTree(collection)} key={collection.id} onNewFolder={onNewFolderHandler} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
