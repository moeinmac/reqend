export type Variable = {
  variable: string;
  value: string;
  source: "Global" | "Environment";
};

export type SuggestionPosition = { top: number; left: number };

export type VariableTooltip = {
  name: string;
  value: string;
  /** Horizontal center of the token in viewport coords */
  x: number;
  /** Bottom of the input in viewport coords */
  y: number;
};

export type State = {
  inputValue: string;
  showSuggestions: boolean;
  suggestionPosition: SuggestionPosition;
  filterText: string;
  cursorPosition: number;
  selectedIndex: number;
  tooltip: VariableTooltip | null;
};

export type Action =
  | { type: "SET_INPUT_VALUE"; payload: string }
  | {
      type: "SHOW_SUGGESTIONS";
      payload: {
        position: SuggestionPosition;
        filterText: string;
        cursorPosition: number;
      };
    }
  | { type: "UPDATE_SUGGESTION_POSITION"; payload: SuggestionPosition }
  | { type: "HIDE_SUGGESTIONS" }
  | { type: "SET_SELECTED_INDEX"; payload: number }
  | { type: "SET_TOOLTIP"; payload: VariableTooltip | null }
  | { type: "SYNC_VALUE"; payload: string };
