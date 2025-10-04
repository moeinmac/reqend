import { fetchRequestHandler, updateRequestUrl } from "@/db/dal/crud-request";
import { Request } from "@/db/models.type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface RequestStore {
  request: Request | null;
  fetchRequest: (reqId: string) => Promise<RequestStore["request"]>;
  removeRequest: () => void;
  onChangeUrl: (newUrl: string) => Promise<void>;
  fetched: boolean;
}

export const useRequestStore = create<RequestStore>()(
  immer((set, get) => ({
    request: null,
    fetched: false,
    fetchRequest: async (reqId) => {
      const request = await fetchRequestHandler(reqId);
      set((state) => {
        state.request = request;
        state.fetched = true;
      });
      return request;
    },
    removeRequest: () => {
      set((state) => {
        state.request = null;
        state.fetched = true;
      });
    },
    onChangeUrl: async (newUrl) => {
      if (!get().request) return;
      const req = await updateRequestUrl(get().request!.id, newUrl);
      set((state) => {
        state.request = req;
      });
    },
  }))
);
