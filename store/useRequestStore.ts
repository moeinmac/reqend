import { fetchRequestHandler, updateRequestMethod, updateRequestUrl } from "@/db/dal/crud-request";
import { Method, Request } from "@/db/models.type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface RequestStore {
  request: Request | null;
  fetched: boolean;
  fetchRequest: (reqId: string) => Promise<RequestStore["request"]>;
  removeRequest: () => void;
  onChangeUrl: (newUrl: string) => Promise<void>;
  onChangeMethod: (newMethod: Method) => Promise<void>;
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
        state.fetched = false;
      });
    },
    onChangeUrl: async (newUrl) => {
      if (!get().request) return;
      const req = await updateRequestUrl(get().request!.id, newUrl);
      set((state) => {
        state.request = req;
      });
    },
    onChangeMethod: async (newMethod) => {
      if (!get().request) return;
      const req = await updateRequestMethod(get().request!.id, newMethod);
      set((state) => {
        state.request = req;
      });
    },
  }))
);
