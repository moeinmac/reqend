import { fetchRequestHandler } from "@/db/dal/crud-request";
import { Request } from "@/db/models.type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface RequestStore {
  requests: Record<string, Request>;
  fetchRequest: (reqId: string) => Promise<Request | undefined>;
}

export const useRequestStore = create<RequestStore>()(
  immer((set, get) => ({
    requests: {},
    fetchRequest: async (reqId) => {
      if (reqId in get().requests) return get().requests[reqId];
      const request = await fetchRequestHandler(reqId);
      if (request) {
        set((state) => {
          state.requests = Object.assign({ [reqId]: request }, state.requests);
        });
        return request;
      }
    },
  }))
);
