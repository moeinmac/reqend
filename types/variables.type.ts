export type Variable = {
  variable: string;
  value: string;
  source: "Global" | "Environment";
};

export type State = {
  inputValue: string;
  showSuggestions: boolean;
  suggestionPosition: { top: number; left: number };
  filterText: string;
  cursorPosition: number;
  tooltip: {
    name: string;
    value: string;
    x: number;
    y: number;
  } | null;
};

export type Action =
  | { type: "SET_INPUT_VALUE"; payload: string }
  | { type: "SHOW_SUGGESTIONS"; payload: { position: { top: number; left: number }; filterText: string; cursorPosition: number } }
  | { type: "HIDE_SUGGESTIONS" }
  | { type: "SET_TOOLTIP"; payload: { name: string; value: string; x: number; y: number } | null }
  | { type: "SYNC_VALUE"; payload: string };
