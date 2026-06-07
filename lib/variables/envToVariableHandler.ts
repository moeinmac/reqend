import { Environment } from "@/db/models.type";
import { Action, State, Variable } from "@/types/variables.type";

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_INPUT_VALUE":
      return { ...state, inputValue: action.payload };
    case "SHOW_SUGGESTIONS":
      return {
        ...state,
        showSuggestions: true,
        suggestionPosition: action.payload.position,
        filterText: action.payload.filterText,
        cursorPosition: action.payload.cursorPosition,
      };
    case "HIDE_SUGGESTIONS":
      return { ...state, showSuggestions: false };
    case "SET_TOOLTIP":
      return { ...state, tooltip: action.payload };
    case "SYNC_VALUE":
      return { ...state, inputValue: action.payload };
    default:
      return state;
  }
};

export const createAvailableVariables = (globalEnv: Environment | undefined, activeEnv: Environment | undefined) => {
  const variables: Variable[] = [];

  activeEnv?.items.forEach((item) => {
    if (item.selected) {
      variables.push({
        variable: item.variable,
        value: item.value,
        source: "Environment",
      });
    }
  });

  globalEnv?.items.forEach((item) => {
    if (item.selected) {
      variables.push({
        variable: item.variable,
        value: item.value,
        source: "Global",
      });
    }
  });
  return variables;
};

export const createVariablesMap = (variables: Variable[]) => new Map(variables.map((v) => [v.variable, v.value]));

export const resolveVariables = (variablesMap: Map<string, string>, text: string): string =>
  text.replace(/<<([^>]+)>>/g, (match, varName) => variablesMap.get(varName) || match);
