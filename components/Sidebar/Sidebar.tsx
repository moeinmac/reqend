"use client";

import { getAllItems } from "@/db/db";
import { Collection } from "@/db/models.type";
import { FC, useEffect, useState } from "react";
import CollectionWrapper from "../Collection/CollectionWrapper";
import NewCollection from "../Collection/NewCollection";
import { draggedCollectionHandler } from "@/db/dal/crud-collection";

const Sidebar: FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      const allCollections = await getAllItems<Collection>("collection");
      if (allCollections) setCollections(allCollections);
    };
    fetchCollections();
  }, []);

  const onNewCollectionHandler = (newCollection: Collection) => setCollections((prev) => [newCollection, ...prev]);
  const onUpdateCollectionHandler = (collection: Collection) =>
    setCollections((prev) => prev.map((col) => (col.id === collection.id ? collection : col)));

  const onMoveHandler = async (collection: Collection) => {
    await draggedCollectionHandler(collection);
    onUpdateCollectionHandler(collection);
  };

  return (
    <div className="col-span-2 p-4">
      <div className="flex items-center gap-4">
        <h3 className="font-bold">Collections</h3>
        <NewCollection onNewCollection={onNewCollectionHandler} />
      </div>
      <div className="flex flex-col gap-3">
        {collections.map((collection) => (
          <CollectionWrapper data={collection} key={collection.id} onNewFolder={onUpdateCollectionHandler} onMove={onMoveHandler} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
