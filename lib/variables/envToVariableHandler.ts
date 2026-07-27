import { Environment } from "@/db/models.type";
import { Action, State, Variable } from "@/types/variables.type";

export const initialVariableInputState = (inputValue = ""): State => ({
  inputValue,
  showSuggestions: false,
  suggestionPosition: { top: 0, left: 0 },
  filterText: "",
  cursorPosition: 0,
  selectedIndex: 0,
  tooltip: null,
});

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
        selectedIndex: 0,
      };
    case "UPDATE_SUGGESTION_POSITION":
      return { ...state, suggestionPosition: action.payload };
    case "HIDE_SUGGESTIONS":
      return { ...state, showSuggestions: false, selectedIndex: 0 };
    case "SET_SELECTED_INDEX":
      return { ...state, selectedIndex: action.payload };
    case "SET_TOOLTIP":
      return { ...state, tooltip: action.payload };
    case "SYNC_VALUE":
      return { ...state, inputValue: action.payload };
    default:
      return state;
  }
};

/** Environment items first, then Global — for the suggestion list UI. */
export const createAvailableVariables = (
  globalEnv: Environment | undefined,
  activeEnv: Environment | undefined,
): Variable[] => {
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

/**
 * Resolve map: Global first, then Environment so active env wins on name collision
 * (Postman precedence).
 */
export const createVariablesMap = (variables: Variable[]): Map<string, string> => {
  const map = new Map<string, string>();

  for (const v of variables) {
    if (v.source === "Global") map.set(v.variable, v.value);
  }
  for (const v of variables) {
    if (v.source === "Environment") map.set(v.variable, v.value);
  }

  return map;
};

export const resolveVariables = (variablesMap: Map<string, string>, text: string): string =>
  text.replace(/<<([^>]+)>>/g, (match, varName) => variablesMap.get(varName) ?? match);
