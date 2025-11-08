import { addEnvHandler, getAllEnvsHandler, removeEnvHandler, renameEnvHandler } from "@/db/dal/crud-env";
import { Environment } from "@/db/models.type";
import { v4 } from "uuid";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface EnvStore {
  envs: Environment[];
  fetchAllEnvs: () => Promise<void>;
  add: (envName: string) => Promise<Environment>;
  remove: (envId: string) => Promise<void>;
  activeEnvId: string;
  changeActiveEnv: (envId: string) => void;
  rename: (envId: string, newName: string) => Promise<Environment | undefined>;
  appMode: "env" | "request";
  changeAppMode: (mode: EnvStore["appMode"]) => void;
}

export const useEnvStore = create<EnvStore>()(
  immer((set, get) => ({
    envs: [],
    appMode: "request",
    activeEnvId: "",
    fetchAllEnvs: async () => {
      const allEnvs = await getAllEnvsHandler();
      if (allEnvs)
        set((state) => {
          state.envs = allEnvs;
          state.activeEnvId = allEnvs[0]?.id;
        });
    },
    add: async (envName) => {
      const newEnv: Environment = {
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        id: v4(),
        items: [],
        name: envName,
      };
      await addEnvHandler(newEnv);
      set((state) => {
        state.envs.push(newEnv);
        state.activeEnvId = newEnv.id;
      });
      return newEnv;
    },
    remove: async (envId: string) => {
      await removeEnvHandler(envId);
      set((state) => {
        state.envs = state.envs.filter((env) => env.id !== envId);
        state.activeEnvId = state.envs.length > 0 ? state.envs[state.envs.length - 1].id : "";
      });
    },
    changeActiveEnv: (envId: string) => {
      set((state) => {
        state.activeEnvId = envId;
      });
    },
    rename: async (envId: string, newName: string) => {
      const envToRename = await renameEnvHandler(envId, newName);
      if (!envToRename) return;
      set((state) => {
        state.envs = state.envs.map((env) => (env.id === envId ? envToRename : env));
      });
      return envToRename;
    },
    changeAppMode: (mode) => {
      set((state) => {
        state.appMode = mode;
      });
    },
  }))
);
