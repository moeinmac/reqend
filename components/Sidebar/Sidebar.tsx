"use client";

import { draggedCollectionHandler, removeCollectionHandler } from "@/db/dal/crud-collection";
import { Collection } from "@/db/models.type";
import { useCollectionStore } from "@/store/useCollectionStore";
import { FC, useEffect } from "react";
import CollectionWrapper from "../Collection/CollectionWrapper";
import MutateCollection from "../Collection/MutateCollection";
import { useShallow } from "zustand/react/shallow";

const Sidebar: FC = () => {
  const collections = useCollectionStore((state) => state.collections);
  const { addCollection, fetchAllCollections, removeCollection, updateCollection } = useCollectionStore(
    useShallow((state) => ({
      fetchAllCollections: state.fetchAllCollections,
      addCollection: state.addCollection,
      removeCollection: state.removeCollection,
      updateCollection: state.updateCollection,
    }))
  );

  useEffect(() => {
    fetchAllCollections();
  }, []);

  const onMoveHandler = async (collection: Collection) => {
    await draggedCollectionHandler(collection);
    updateCollection(collection);
  };

  const onRemoveHandler = async (collectionId: string) => {
    await removeCollectionHandler(collectionId);
    removeCollection(collectionId);
  };

  return (
    <div className="col-span-2 p-4">
      <div className="flex items-center gap-4">
        <h3 className="font-bold">Collections</h3>
        <MutateCollection mode="new" onNewCollection={addCollection} />
      </div>
      <div className="flex flex-col gap-3">
        {collections.map((collection) => (
          <CollectionWrapper
            data={collection}
            key={collection.id}
            onNewFolder={updateCollection}
            onMove={onMoveHandler}
            onRemoveCollection={onRemoveHandler}
            onRenameCollection={updateCollection}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
