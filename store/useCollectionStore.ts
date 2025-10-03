import { getAllItems } from "@/db/db";
import { Collection } from "@/db/models.type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface CollectionStore {
  collections: Collection[];
  fetchAllCollections: () => Promise<void>;
  addCollection: (collection: Collection) => void;
  updateCollection: (updatedCollection: Collection) => void;
  removeCollection: (collectionId: string) => void;
}

export const useCollectionStore = create<CollectionStore>()(
  immer((set) => ({
    collections: [],
    fetchAllCollections: async () => {
      const allCollections = await getAllItems<Collection>("collection");
      if (allCollections)
        set((state) => {
          state.collections = allCollections;
        });
    },
    addCollection: (collection) =>
      set((state) => {
        state.collections.unshift(collection);
      }),

    updateCollection: (updatedCollection) =>
      set((state) => {
        state.collections = state.collections.map((col) => (col.id === updatedCollection.id ? updatedCollection : col));
      }),
    removeCollection: (collectionId) =>
      set((state) => {
        state.collections = state.collections.filter((collection) => collection.id !== collectionId);
      }),
  }))
);
