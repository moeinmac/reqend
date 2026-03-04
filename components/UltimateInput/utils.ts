import { Action, State } from "./index.type";

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
