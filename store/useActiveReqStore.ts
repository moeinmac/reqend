import {
  addTempActiveRequest,
  DEFAULT_REQ_METHOD,
  removeActiveRequest,
  saveActiveReqHandler,
  updateActiveReqNameHandler,
} from "@/db/dal/crud-activeReq";
import { newRequestHandler } from "@/db/dal/crud-request";
import { getAllItems } from "@/db/db";
import { ActiveRequest } from "@/db/models.type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useRequestStore } from "./useRequestStore";

export interface ActiveReqStore {
  activeRequests: ActiveRequest[];
  fetchAllActiveReqs: () => Promise<void>;
  add: (activeReq: ActiveRequest) => void;
  update: (updated: ActiveRequest) => void;
  remove: (reqId: string) => Promise<void>;
  addTemp: () => Promise<{ id: string; name: string }>;
  loading: boolean;
  activeReqId: string;
  setActiveReqId: (id: string) => Promise<void>;
  updateName: (reqId: string, newName: string) => Promise<void>;
  save: (reqId: string, collectionId: string) => Promise<ActiveRequest | null>;
}

export const useActiveReqStore = create<ActiveReqStore>()(
  immer((set) => ({
    activeRequests: [],
    loading: true,
    activeReqId: "",
    setActiveReqId: async (id: string) => {
      await useRequestStore.getState().fetchRequest(id);
      set((state) => {
        state.activeReqId = id;
      });
    },
    fetchAllActiveReqs: async () => {
      const allReqs = await getAllItems<ActiveRequest>("activeReq");
      if (allReqs)
        set((state) => {
          state.activeRequests = allReqs;
          state.loading = false;
          state.activeReqId = allReqs[0]?.id || "";
        });
    },
    addTemp: async () => {
      const tempReq = await addTempActiveRequest();
      await newRequestHandler({
        id: tempReq.id,
        name: tempReq.name,
        method: DEFAULT_REQ_METHOD,
        url: "",
        body: null,
        params: [],
        auth: null,
        type: "request",
      });
      await useRequestStore.getState().fetchRequest(tempReq.id);
      set((state) => {
        state.activeRequests.push(tempReq);
        state.activeReqId = tempReq.id;
      });
      return { id: tempReq.id, name: tempReq.name };
    },
    add: (activeReq) =>
      set((state) => {
        state.activeRequests.push(activeReq);
        state.activeReqId = activeReq.id;
      }),

    update: (updated) =>
      set((state) => {
        state.activeRequests = state.activeRequests.map((req) => (req.id === updated.id ? updated : req));
      }),
    remove: async (reqId) => {
      await removeActiveRequest(reqId);
      useRequestStore.getState().removeRequest();
      set((state) => {
        state.activeRequests = state.activeRequests.filter((req) => req.id !== reqId);
        state.activeReqId = state.activeRequests.length > 0 ? state.activeRequests[state.activeRequests.length - 1].id : "";
      });
    },
    updateName: async (reqId, newName) => {
      await updateActiveReqNameHandler(reqId, newName);
      set((state) => {
        state.activeRequests = state.activeRequests.map((req) => (req.id === reqId ? { ...req, name: newName } : req));
      });
    },
    save: async (reqId, collectionId) => {
      const savedReq = await saveActiveReqHandler(reqId, collectionId);
      if (savedReq) {
        set((state) => {
          state.activeRequests = state.activeRequests.map((req) => (req.id === reqId ? { ...req, collectionId } : req));
        });
      }
      return savedReq;
    },
  }))
);
