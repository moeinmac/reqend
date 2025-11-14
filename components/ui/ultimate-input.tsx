import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { useEnvStore } from "@/store/useEnvStore";
import {
  ChangeEvent,
  forwardRef,
  InputHTMLAttributes,
  MouseEvent as ReactMouseEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";

interface UltimateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: string;
  onChange?: (value: string) => void;
}

interface Variable {
  variable: string;
  value: string;
  source: "Global" | "Environment";
}

interface State {
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
}

type Action =
  | { type: "SET_INPUT_VALUE"; payload: string }
  | {
      type: "SHOW_SUGGESTIONS";
      payload: {
        position: { top: number; left: number };
        filterText: string;
        cursorPosition: number;
      };
    }
  | { type: "HIDE_SUGGESTIONS" }
  | {
      type: "SET_TOOLTIP";
      payload: { name: string; value: string; x: number; y: number } | null;
    }
  | { type: "SYNC_VALUE"; payload: string };

const reducer = (state: State, action: Action): State => {
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

const UltimateInput = forwardRef<HTMLInputElement, UltimateInputProps>(({ value = "", onChange, ...props }, ref) => {
  const [state, dispatch] = useReducer(reducer, {
    inputValue: value,
    showSuggestions: false,
    suggestionPosition: { top: 0, left: 0 },
    filterText: "",
    cursorPosition: 0,
    tooltip: null,
  });

  const envs = useEnvStore((state) => state.getCurrentEnvs)();

  const activeEnvironment = envs?.activeEnv;
  const globalEnvironment = envs?.globalEnv;

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") ref(inputRef.current);
    else (ref as RefObject<HTMLInputElement | null>).current = inputRef.current;
  }, [ref]);

  useEffect(() => {
    if (value !== state.inputValue) dispatch({ type: "SYNC_VALUE", payload: value || "" });
  }, [value, state.inputValue]);

  const availableVariables = useMemo(() => {
    const variables: Variable[] = [];

    activeEnvironment?.items.forEach((item) => {
      if (item.selected) {
        variables.push({
          variable: item.variable,
          value: item.value,
          source: "Environment",
        });
      }
    });

    globalEnvironment?.items.forEach((item) => {
      if (item.selected) {
        variables.push({
          variable: item.variable,
          value: item.value,
          source: "Global",
        });
      }
    });

    return variables;
  }, [activeEnvironment, globalEnvironment]);

  const variableMap = useMemo(() => {
    return new Map(availableVariables.map((v) => [v.variable, v.value]));
  }, [availableVariables]);

  const filteredVariables = useMemo(() => {
    if (!state.filterText) return availableVariables;
    const lowerFilter = state.filterText.toLowerCase();
    return availableVariables.filter((v) => v.variable.toLowerCase().includes(lowerFilter));
  }, [availableVariables, state.filterText]);

  const extractVariables = useCallback((text: string) => {
    const regex = /<<([^>]+)>>/g;
    const matches: Array<{ name: string; start: number; end: number }> = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      matches.push({
        name: match[1],
        start: match.index,
        end: match.index + match[0].length,
      });
    }

    return matches;
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart || 0;

    dispatch({ type: "SET_INPUT_VALUE", payload: newValue });
    onChange?.(newValue);

    const beforeCursor = newValue.substring(0, cursorPos);
    const lastDoubleBracket = beforeCursor.lastIndexOf("<<");

    if (lastDoubleBracket !== -1) {
      const afterBracket = newValue.substring(lastDoubleBracket + 2, cursorPos);

      if (!afterBracket.includes(">>")) {
        const rect = inputRef.current?.getBoundingClientRect();
        if (rect)
          dispatch({
            type: "SHOW_SUGGESTIONS",
            payload: {
              position: {
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
              },
              filterText: afterBracket,
              cursorPosition: cursorPos,
            },
          });
        return;
      }
    }

    dispatch({ type: "HIDE_SUGGESTIONS" });
  };

  const handleSelectVariable = (variable: string) => {
    const currentValue = state.inputValue;
    const cursorPos = state.cursorPosition;
    const beforeCursor = currentValue.substring(0, cursorPos);
    const afterCursor = currentValue.substring(cursorPos);
    const lastDoubleBracket = beforeCursor.lastIndexOf("<<");

    if (lastDoubleBracket !== -1) {
      const before = currentValue.substring(0, lastDoubleBracket);
      const newValue = `${before}<<${variable}>>${afterCursor}`;

      dispatch({ type: "SET_INPUT_VALUE", payload: newValue });
      onChange?.(newValue);
      dispatch({ type: "HIDE_SUGGESTIONS" });

      setTimeout(() => {
        const newCursorPos = lastDoubleBracket + variable.length + 4;
        inputRef.current?.setSelectionRange(newCursorPos, newCursorPos);
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleMouseMove = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) return;

      const rect = input.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const relativeX = x + input.scrollLeft;

      const charWidth = input.scrollWidth / state.inputValue.length || 8;
      const charIndex = Math.floor(relativeX / charWidth);

      const variables = extractVariables(state.inputValue);
      const hoveredVar = variables.find((v) => charIndex >= v.start && charIndex < v.end);

      if (hoveredVar) {
        const value = variableMap.get(hoveredVar.name);
        if (value) {
          dispatch({
            type: "SET_TOOLTIP",
            payload: {
              name: hoveredVar.name,
              value,
              x: e.clientX,
              y: e.clientY,
            },
          });
          return;
        }
      }

      dispatch({ type: "SET_TOOLTIP", payload: null });
    },
    [state.inputValue, variableMap, extractVariables]
  );

  const handleMouseLeave = useCallback(() => {
    dispatch({ type: "SET_TOOLTIP", payload: null });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && !inputRef.current?.contains(event.target as Node)) {
        dispatch({ type: "HIDE_SUGGESTIONS" });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="relative">
        <Input ref={inputRef} value={state.inputValue} onChange={handleInputChange} {...props} />
      </div>

      {state.tooltip && (
        <div
          className="fixed z-[100] bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-lg max-w-xs break-all pointer-events-none"
          style={{
            top: state.tooltip.y + 10,
            left: state.tooltip.x + 10,
          }}
        >
          <div className="text-gray-300">{state.tooltip.value}</div>
        </div>
      )}

      {state.showSuggestions && (
        <div
          ref={dropdownRef}
          className="fixed z-50 w-72 bg-white border rounded-md shadow-md"
          style={{
            top: state.suggestionPosition.top,
            left: state.suggestionPosition.left,
          }}
        >
          <Command className="rounded-md">
            <CommandList className="max-h-64">
              {filteredVariables.length === 0 ? (
                <CommandEmpty className="py-6 text-sm text-center text-muted-foreground">No variables found</CommandEmpty>
              ) : (
                <CommandGroup>
                  {filteredVariables.map((v, idx) => (
                    <CommandItem
                      key={`${v.variable}-${idx}`}
                      onSelect={() => handleSelectVariable(v.variable)}
                      className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                    >
                      <div
                        className={`flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded ${
                          v.source === "Global"
                            ? "bg-blue-900 text-blue-200 border border-blue-300"
                            : "bg-green-900 text-green-200 border border-green-300"
                        }`}
                      >
                        {v.source === "Global" ? "G" : "E"}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium text-sm truncate">{v.variable}</span>
                        <span className="text-xs text-muted-foreground truncate">{v.value}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
});

export default UltimateInput;
