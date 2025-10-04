import { fetchRequestHandler } from "@/db/dal/crud-request";
import { Request } from "@/db/models.type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface RequestStore {
  request: Request | null;
  fetchRequest: (reqId: string) => Promise<RequestStore["request"]>;
  removeRequest: () => void;
}

export const useRequestStore = create<RequestStore>()(
  immer((set) => ({
    request: null,
    fetchRequest: async (reqId) => {
      const request = await fetchRequestHandler(reqId);
      set((state) => {
        state.request = request;
      });
      return request;
    },
    removeRequest: () => {
      set((state) => {
        state.request = null;
      });
    },
  }))
);
