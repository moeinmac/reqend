"use client";

import { FC, useEffect, useState } from "react";
import CollectionWrapper from "../Collection/CollectionWrapper";
import NewCollection from "../Collection/NewCollection";
import { getAllItems } from "@/db/db";
import { Collection } from "@/db/models.type";

const Sidebar: FC = () => {
  const [collections, setCollection] = useState<Collection[]>([]);
  useEffect(() => {
    const fetchCollections = async () => {
      const allCollections = await getAllItems<Collection>("collection");
      if (allCollections) setCollection(allCollections);
    };
    fetchCollections();
  }, []);

  const onNewCollectionHandler = (newCollection: Collection) => setCollection((prev) => [newCollection, ...prev]);
  return (
    <div className="col-span-2 p-4">
      <div className="flex items-center gap-4">
        <h3 className="font-bold">Collections</h3>
        <NewCollection onNewCollection={onNewCollectionHandler} />
      </div>
      <div className="flex flex-col gap-3">
        {collections.map((collection) => (
          <CollectionWrapper data={collection} key={collection.id} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
