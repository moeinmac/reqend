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
  NewRequestInput,
  removeRequestInCollectionHandler,
  RemoveRequestInput,
} from "@/db/dal/crud-collection";
import { getAllItems } from "@/db/db";
import { Collection, RequestPrimary } from "@/db/models.type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useActiveReqStore } from "./useActiveReqStore";
import { v4 } from "uuid";
import { DEFAULT_REQ_METHOD } from "@/db/dal/crud-activeReq";
import { removeRequestHandler } from "@/db/dal/crud-request";

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
  addNewRequest: (input: NewRequestInput) => Promise<void>;
  removeRequest: (input: RemoveRequestInput) => Promise<void>;
}

export const useCollectionStore = create<CollectionStore>()(
  immer((set, get) => ({
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
    newFolder: async (mutateFolderInput) => {
      const updatedCollection = await newFolderHandler(mutateFolderInput);
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
    addNewRequest: async (input) => {
      const { id, name } = await useActiveReqStore.getState().addTemp(input.collectionId);
      await get().saveRequest({
        collectionId: input.collectionId,
        requestPrimary: { id, method: DEFAULT_REQ_METHOD, name, type: "request" },
        targetId: input.targetId,
      });
    },
    removeRequest: async (input) => {
      const updatedCollection = await removeRequestInCollectionHandler(input);
      await useActiveReqStore.getState().remove(input.targetId);
      await removeRequestHandler(input.targetId);
      if (updatedCollection)
        set((state) => {
          state.collections = state.collections.map((col) => (col.id === updatedCollection.id ? updatedCollection : col));
        });
    },
  }))
);
