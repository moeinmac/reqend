import { Params } from "@/db/models.type";
import { resolveVariables } from "./envToVariableHandler";

export const urlResolver = (url: string, variablesMap: Map<string, string>) => resolveVariables(variablesMap, url);

export const paramsResolver = (params: Params[], variablesMap: Map<string, string>) =>
  params.map((param) => ({ ...param, key: resolveVariables(variablesMap, param.key), value: resolveVariables(variablesMap, param.value) }));
