import {
  addEnvHandler,
  addNewEnvItemHandler,
  getAllEnvsHandler,
  removeEnvHandler,
  removeEnvItemHandler,
  renameEnvHandler,
  secretlyCreateGlobalEnv,
  updateEnvItemsHandler,
} from "@/db/dal/crud-env";
import { Environment, EnvironmentItem } from "@/db/models.type";
import { RowSelectionState } from "@tanstack/react-table";
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
  addNewEnvItem: () => Promise<EnvironmentItem | undefined>;
  updateEnvItems: (rowIndex: number, columnId: string, value: unknown) => Promise<EnvironmentItem[] | undefined>;
  deleteEnvItem: (rowId: string) => Promise<void>;
  updateSelectItem: (updaterOrValue: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)) => Promise<void>;
  getCurrentEnvs: () => { globalEnv?: Environment; activeEnv?: Environment };
}

export const useEnvStore = create<EnvStore>()(
  immer((set, get) => ({
    envs: [],
    appMode: "request",
    activeEnvId: "",
    fetchAllEnvs: async () => {
      const allEnvs = await getAllEnvsHandler();
      await secretlyCreateGlobalEnv();
      if (allEnvs) {
        const withNoGlobal = allEnvs.filter((env) => env.id !== "global");
        const activeEnvId = withNoGlobal.length === 0 ? allEnvs[0]?.id : withNoGlobal[withNoGlobal.length - 1].id;
        set((state) => {
          state.envs = allEnvs;
          state.activeEnvId = activeEnvId;
        });
      }
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
    addNewEnvItem: async () => {
      const { activeEnvId } = get();
      if (!activeEnvId) return;
      const result = await addNewEnvItemHandler(activeEnvId);
      if (result) {
        set((state) => {
          state.envs = state.envs.map((env) => (env.id === activeEnvId ? result.updatedEnv : env));
        });
        return result.newEnv;
      }
    },
    updateEnvItems: async (rowIndex: number, columnId: string, value: unknown) => {
      const { activeEnvId, envs } = get();
      if (!activeEnvId) return;
      const thisEnv = envs.find((env) => env.id === activeEnvId);
      if (!thisEnv) return;
      const newData = thisEnv.items.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...thisEnv.items[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      });
      const updatedEnv = await updateEnvItemsHandler(newData, activeEnvId);
      if (updatedEnv)
        set((state) => {
          state.envs = state.envs.map((env) => (env.id === activeEnvId ? updatedEnv : env));
        });
      return newData;
    },
    deleteEnvItem: async (rowId) => {
      const { activeEnvId } = get();
      if (!activeEnvId) return;
      const updatedEnv = await removeEnvItemHandler(rowId, activeEnvId);
      if (updatedEnv)
        set((state) => {
          state.envs = state.envs.map((env) => (env.id === activeEnvId ? updatedEnv : env));
        });
    },
    updateSelectItem: async (updaterOrValue) => {
      const { activeEnvId, envs } = get();
      if (!activeEnvId) return;
      const thisEnv = envs.find((env) => env.id === activeEnvId);
      if (!thisEnv) return;
      const currentRowSelection = thisEnv.items.reduce((acc, param, index) => {
        if (param.selected) {
          acc[index] = true;
        }
        return acc;
      }, {} as RowSelectionState);
      const newRowSelection = typeof updaterOrValue === "function" ? updaterOrValue(currentRowSelection) : updaterOrValue;
      const newEnv: EnvironmentItem[] = thisEnv.items.map((param, index) => ({
        ...param,
        selected: !!newRowSelection[index],
      }));
      const updatedEnv = await updateEnvItemsHandler(newEnv, activeEnvId);
      if (updatedEnv)
        set((state) => {
          state.envs = state.envs.map((env) => (env.id === activeEnvId ? updatedEnv : env));
        });
    },
    getCurrentEnvs: () => {
      const activeEnvId = get().activeEnvId;
      const envs = get().envs;
      if (!activeEnvId) {
        if (envs.length === 0) return {};
        const globalEnv = envs.find((e) => e.id === "global");
        return { globalEnv };
      }
      const activeEnv = envs.find((e) => e.id === activeEnvId);
      const globalEnv = envs.find((e) => e.id === "global");
      return { activeEnv, globalEnv };
    },
  }))
);
