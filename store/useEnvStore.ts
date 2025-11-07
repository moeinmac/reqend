import { addEnvHandler, getAllEnvsHandler, removeEnvHandler } from "@/db/dal/crud-env";
import { Environment } from "@/db/models.type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface EnvStore {
  envs: Environment[];
  fetchAllEnvs: () => Promise<void>;
  add: (newEnv: Environment) => Promise<void>;
  remove: (envId: string) => Promise<void>;
  activeEnvId: string;
}

export const useEnvStore = create<EnvStore>()(
  immer((set, get) => ({
    envs: [],
    activeEnvId: "",
    fetchAllEnvs: async () => {
      const allEnvs = await getAllEnvsHandler();
      if (allEnvs)
        set((state) => {
          state.envs = allEnvs;
          state.activeEnvId = allEnvs[0].id;
        });
    },
    add: async (newEnv: Environment) => {
      await addEnvHandler(newEnv);
      set((state) => {
        state.envs.push(newEnv);
        state.activeEnvId = newEnv.id;
      });
    },
    remove: async (envId: string) => {
      await removeEnvHandler(envId);
      set((state) => {
        state.envs = state.envs.filter((env) => env.id !== envId);
        state.activeEnvId = state.envs.length > 0 ? state.envs[state.envs.length - 1].id : "";
      });
    },
  }))
);
