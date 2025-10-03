import { addTempActiveRequest } from "@/db/dal/crud-activeReq";
import { getAllItems } from "@/db/db";
import { ActiveRequest } from "@/db/models.type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface ActiveReqStore {
  activeRequests: ActiveRequest[];
  fetchAllActiveReqs: () => Promise<void>;
  add: (activeReq: ActiveRequest) => void;
  update: (updated: ActiveRequest) => void;
  remove: (reqId: string) => void;
  addTemp: () => Promise<void>;
  loading: boolean;
}

export const useActiveReqStore = create<ActiveReqStore>()(
  immer((set) => ({
    activeRequests: [],
    loading: true,
    fetchAllActiveReqs: async () => {
      const allReqs = await getAllItems<ActiveRequest>("activeReq");
      if (allReqs)
        set((state) => {
          state.activeRequests = allReqs;
          state.loading = false;
        });
    },
    addTemp: async () => {
      const tempReq = await addTempActiveRequest();
      set((state) => {
        state.activeRequests.push(tempReq);
      });
    },
    add: (activeReq) =>
      set((state) => {
        state.activeRequests.push(activeReq);
      }),

    update: (updated) =>
      set((state) => {
        state.activeRequests = state.activeRequests.map((req) => (req.id === updated.id ? updated : req));
      }),
    remove: (reqId) =>
      set((state) => {
        state.activeRequests = state.activeRequests.filter((req) => req.id !== reqId);
      }),
  }))
);
