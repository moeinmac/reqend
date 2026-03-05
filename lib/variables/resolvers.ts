import { resolveVariables } from "./envToVariableHandler";

export const urlResolver = (url: string, variablesMap: Map<string, string>) => {
  const resolvedUrl = resolveVariables(variablesMap, url);
  return resolvedUrl;
};
