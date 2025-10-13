import {
  draggedCollectionHandler,
  newCollectionHandler,
  newFolderHandler,
  MutateFolderInput,
  removeCollectionHandler,
  renameCollectionHandler,
  RequestUpdate,
  saveRequestHandler,
  SaveRequestInput,
  updateRequestInCollection,
  renameFolderHandler,
} from "@/db/dal/crud-collection";
import { getAllItems } from "@/db/db";
import { Collection } from "@/db/models.type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface CollectionStore {
  collections: Collection[];
  fetchAllCollections: () => Promise<void>;
  addCollection: (collectionName: string) => Promise<Collection | undefined>;
  updateCollection: (updatedCollection: Collection) => void;
  removeCollection: (collectionId: string) => Promise<void>;
  newFolder: (mutateFolderInput: MutateFolderInput) => Promise<Collection | undefined>;
  renameFolder: (mutateFolderInput: MutateFolderInput) => Promise<Collection | undefined>;
  renameCollection: (collectionId: string, newName: string) => Promise<Collection | undefined>;
  moveCollection: (draggedCollection: Collection) => Promise<void>;
  saveRequest: (input: SaveRequestInput) => Promise<Collection | undefined>;
  updateRequestCollection: (collectionId: string, requestId: string, updates: RequestUpdate) => Promise<false | Collection>;
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
    updateRequestCollection: async (collectionId, requestId, updates) => {
      const updatedCollection = await updateRequestInCollection(collectionId, requestId, updates);
      if (updatedCollection) {
        set((state) => {
          state.collections = state.collections.map((col) => (col.id === updatedCollection.id ? updatedCollection : col));
        });
      }
      return updatedCollection;
    },
    addCollection: async (collectionName) => {
      const updatedCollection = await newCollectionHandler(collectionName);
      set((state) => {
        state.collections.unshift(updatedCollection);
      });
      return updatedCollection;
    },

    updateCollection: (updatedCollection) =>
      set((state) => {
        state.collections = state.collections.map((col) => (col.id === updatedCollection.id ? updatedCollection : col));
      }),

    renameCollection: async (collectionId, newName) => {
      const updatedCollection = await renameCollectionHandler(collectionId, newName);
      if (updatedCollection)
        set((state) => {
          state.collections = state.collections.map((col) => (col.id === updatedCollection.id ? updatedCollection : col));
        });
      return updatedCollection;
    },

    removeCollection: async (collectionId) => {
      await removeCollectionHandler(collectionId);
      set((state) => {
        state.collections = state.collections.filter((col) => col.id !== collectionId);
      });
    },
    newFolder: async (MutateFolderInput) => {
      const updatedCollection = await newFolderHandler(MutateFolderInput);
      if (updatedCollection)
        set((state) => {
          state.collections = state.collections.map((col) => (col.id === updatedCollection.id ? updatedCollection : col));
        });
      return updatedCollection;
    },
    renameFolder: async (mutateFolderInput) => {
      const updatedCollection = await renameFolderHandler(mutateFolderInput);
      if (updatedCollection)
        set((state) => {
          state.collections = state.collections.map((col) => (col.id === updatedCollection.id ? updatedCollection : col));
        });
      return updatedCollection;
    },
    moveCollection: async (draggedCollection) => {
      const updatedCollection = await draggedCollectionHandler(draggedCollection);
      if (updatedCollection)
        set((state) => {
          state.collections = state.collections.map((col) => (col.id === updatedCollection.id ? updatedCollection : col));
        });
    },
    saveRequest: async (input) => {
      const updatedCollection = await saveRequestHandler(input);
      if (updatedCollection)
        set((state) => {
          state.collections = state.collections.map((col) => (col.id === updatedCollection.id ? updatedCollection : col));
        });
      return updatedCollection;
    },
  }))
);
