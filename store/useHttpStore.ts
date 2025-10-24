import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface HttpStore {
  changeCardMode: (mode: "option" | "response") => void;
  cardMode: "option" | "response";
}

export const useHttpStore = create<HttpStore>()(
  immer((set) => ({
    cardMode: "option",
    changeCardMode: (mode) => {
      set((state) => {
        state.cardMode = mode;
      });
    },
  }))
);
