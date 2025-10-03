import { addTempActiveRequest, removeActiveRequest } from "@/db/dal/crud-activeReq";
import { getAllItems } from "@/db/db";
import { ActiveRequest } from "@/db/models.type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface ActiveReqStore {
  activeRequests: ActiveRequest[];
  fetchAllActiveReqs: () => Promise<void>;
  add: (activeReq: ActiveRequest) => void;
  update: (updated: ActiveRequest) => void;
  remove: (reqId: string) => Promise<void>;
  addTemp: () => Promise<{ id: string; name: string }>;
  loading: boolean;
  activeReqId: string;
  setActiveReqId: (id: string) => void;
}

export const useActiveReqStore = create<ActiveReqStore>()(
  immer((set) => ({
    activeRequests: [],
    loading: true,
    activeReqId: "",
    setActiveReqId: (id: string) =>
      set((state) => {
        state.activeReqId = id;
      }),
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
      set((state) => {
        state.activeRequests = state.activeRequests.filter((req) => req.id !== reqId);
        state.activeReqId = state.activeRequests.length > 0 ? state.activeRequests[state.activeRequests.length - 1].id : "";
      });
    },
  }))
);
