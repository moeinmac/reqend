import { addNewHeaderHandler, removeHeaderHandler, updateHeadersHandler } from "@/db/dal/crud-headers";
import { addNewParamsHandler, removeParamHandler, updateParamsHandler } from "@/db/dal/crud-params";
import {
  fetchRequestHandler,
  updateAuthTypeHandler,
  updateAuthValueHandler,
  updateBodyTypeHandler,
  updateBodyValueHandler,
  updateRequestMethod,
  updateRequestNameHandler,
  updateRequestUrl,
} from "@/db/dal/crud-request";
import { Auth, Body, Method, Params, Request } from "@/db/models.type";
import { RowSelectionState } from "@tanstack/react-table";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface RequestStoreMethods {
  fetchRequest: (reqId: string) => Promise<RequestStore["request"]>;
  removeRequest: () => void;
  onChangeUrl: (newUrl: string) => Promise<void>;
  onChangeMethod: (newMethod: Method) => Promise<void>;
  onChangeName: (newName: string) => Promise<void>;
  addNewParam: () => Promise<Params | undefined>;
  updateParams: (rowIndex: number, columnId: string, value: unknown) => Promise<Params[] | undefined>;
  deleteParam: (rowId: string) => Promise<void>;
  updateSelectParam: (updaterOrValue: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)) => Promise<void>;
  updateAuthType: (authType: Auth["authType"]) => Promise<void>;
  updateAuthValue: (authValue: Auth["value"]) => Promise<void>;
  updateBodyType: (bodyType: Body["type"]) => Promise<void>;
  updateBodyValue: (bodyValue: Body["content"]) => Promise<void>;

  addNewHeader: () => Promise<Params | undefined>;
  updateHeaders: (rowIndex: number, columnId: string, value: unknown) => Promise<Request["headers"] | undefined>;
  deleteHeader: (rowId: string) => Promise<void>;
  updateSelectHeader: (updaterOrValue: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)) => Promise<void>;
}

export interface RequestNotFetched extends RequestStoreMethods {
  request: null;
  fetched: false;
}

export interface RequestFetched extends RequestStoreMethods {
  request: Request;
  fetched: true;
}

export type RequestStore = RequestFetched | RequestNotFetched;

export const useRequestStore = create<RequestStore>()(
  immer((set, get) => ({
    request: null,
    fetched: false,
    cardMode: "option",
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
    onChangeName: async (newName) => {
      if (!get().request) return;
      const req = await updateRequestNameHandler(get().request!.id, newName);
      set((state) => {
        state.request = req;
      });
    },
    addNewParam: async () => {
      const { fetched, request } = get();
      if (!fetched) return;
      const result = await addNewParamsHandler(request.id);
      if (result) {
        set((state) => {
          state.request = result.updatedReq;
        });
        return result.newParam;
      }
    },
    updateParams: async (rowIndex: number, columnId: string, value: unknown) => {
      const { fetched, request } = get();
      if (!fetched) return;
      const newData = request.params.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...request.params[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      });
      const req = await updateParamsHandler(newData, request.id);
      if (req)
        set((state) => {
          state.request = req;
        });
      return newData;
    },
    deleteParam: async (rowId) => {
      const { fetched, request } = get();
      if (!fetched) return;
      const req = await removeParamHandler(rowId, request.id);
      if (req)
        set((state) => {
          state.request = req;
        });
    },
    updateSelectParam: async (updaterOrValue) => {
      const { fetched, request } = get();
      if (!fetched) return;
      const currentRowSelection = request.params.reduce((acc, param, index) => {
        if (param.selected) {
          acc[index] = true;
        }
        return acc;
      }, {} as RowSelectionState);
      const newRowSelection = typeof updaterOrValue === "function" ? updaterOrValue(currentRowSelection) : updaterOrValue;
      const newParam: Params[] = request.params.map((param, index) => ({
        ...param,
        selected: !!newRowSelection[index],
      }));
      const req = await updateParamsHandler(newParam, request.id);
      if (req)
        set((state) => {
          state.request = req;
        });
    },
    updateAuthType: async (authType) => {
      const { fetched, request } = get();
      if (!fetched) return;
      const req = await updateAuthTypeHandler(request.id, authType);
      if (req)
        set((state) => {
          state.request = req;
        });
    },
    updateAuthValue: async (authValue) => {
      const { fetched, request } = get();
      if (!fetched) return;
      const req = await updateAuthValueHandler(request.id, authValue);
      if (req)
        set((state) => {
          state.request = req;
        });
    },
    updateBodyType: async (bodyType) => {
      const { fetched, request } = get();
      if (!fetched) return;
      const req = await updateBodyTypeHandler(request.id, bodyType);
      if (req)
        set((state) => {
          state.request = req;
        });
    },
    updateBodyValue: async (bodyValue) => {
      const { fetched, request } = get();
      if (!fetched) return;
      const req = await updateBodyValueHandler(request.id, bodyValue);
      if (req)
        set((state) => {
          state.request = req;
        });
    },
    addNewHeader: async () => {
      const { fetched, request } = get();
      if (!fetched) return;
      const result = await addNewHeaderHandler(request.id);
      if (result) {
        set((state) => {
          state.request = result.updatedReq;
        });
        return result.newHeader;
      }
    },
    updateHeaders: async (rowIndex: number, columnId: string, value: unknown) => {
      const { fetched, request } = get();
      if (!fetched) return;
      const newData = request.headers.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...request.headers[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      });
      const req = await updateHeadersHandler(newData, request.id);
      if (req)
        set((state) => {
          state.request = req;
        });
      return newData;
    },
    deleteHeader: async (rowId) => {
      const { fetched, request } = get();
      if (!fetched) return;
      const req = await removeHeaderHandler(rowId, request.id);
      if (req)
        set((state) => {
          state.request = req;
        });
    },
    updateSelectHeader: async (updaterOrValue) => {
      const { fetched, request } = get();
      if (!fetched) return;
      const currentRowSelection = request.headers.reduce((acc, header, index) => {
        if (header.selected) {
          acc[index] = true;
        }
        return acc;
      }, {} as RowSelectionState);
      const newRowSelection = typeof updaterOrValue === "function" ? updaterOrValue(currentRowSelection) : updaterOrValue;
      const newHeader: Request["headers"] = request.headers.map((header, index) => ({
        ...header,
        selected: !!newRowSelection[index],
      }));
      const req = await updateHeadersHandler(newHeader, request.id);
      if (req)
        set((state) => {
          state.request = req;
        });
    },
  }))
);
