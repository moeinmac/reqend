import { requestHandler } from "@/lib/requestHandler";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useRequestStore } from "./useRequestStore";
import { toast } from "sonner";

export interface HttpResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
  size: number;
}

export interface HttpStore {
  changeCardMode: (mode: HttpStore["cardMode"]) => void;
  cardMode: "option" | "response" | "env";
  isSubmitting: boolean;
  response: HttpResponse | null;
  error: Error | null;
  sendRequest: () => Promise<void>;
  resetResponse: () => void;
}

export const useHttpStore = create<HttpStore>()(
  immer((set, get) => ({
    isSubmitting: false,
    cardMode: "option",
    response: null,
    error: null,

    changeCardMode: (mode) => {
      set((state) => {
        state.cardMode = mode;
      });
    },
    resetResponse: () => {
      set((state) => {
        state.cardMode = "option";
        state.error = null;
        state.response = null;
        state.isSubmitting = false;
      });
    },

    sendRequest: async () => {
      const currentRequest = useRequestStore.getState().request;
      if (!currentRequest) return;

      set((state) => {
        state.isSubmitting = true;
        state.error = null;
        state.response = null;
      });

      try {
        const response = await requestHandler(currentRequest);

        set((state) => {
          state.response = response;
          state.cardMode = "response";
        });
      } catch (error: any) {
        toast.error(error.message);
        set((state) => {
          state.error = error as Error;
          state.cardMode = "response";
        });
      } finally {
        set((state) => {
          state.isSubmitting = false;
        });
      }
    },
  }))
);
