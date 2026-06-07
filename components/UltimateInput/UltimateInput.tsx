import { useEnvStore } from "@/store/useEnvStore";
import { ComponentProps, FC, useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "../ui/command";
import { Input } from "../ui/input";
import { createAvailableVariables, createVariablesMap, reducer, resolveVariables } from "@/lib/variables/envToVariableHandler";

interface UltimateInputProps extends Omit<ComponentProps<"input">, "value" | "onChange"> {
  onResolvedChange?: (resolvedValue: string) => void;
  onRawValueChange: (rawValue: string) => void;
  value: string;
}

const UltimateInput: FC<UltimateInputProps> = ({ onResolvedChange, onRawValueChange, ...props }) => {
  const { ref: outputRef, value, ...otherProps } = props;

  const [state, dispatch] = useReducer(reducer, {
    inputValue: value,
    showSuggestions: false,
    suggestionPosition: { top: 0, left: 0 },
    filterText: "",
    cursorPosition: 0,
    tooltip: null,
  });

  const insideRef = useRef<HTMLInputElement>(null);

  const inputRef = (outputRef ?? insideRef) as React.RefObject<HTMLInputElement | null>;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { envs, activeEnvId } = useEnvStore(useShallow((state) => ({ envs: state.envs, activeEnvId: state.activeEnvId })));

  const { activeEnv, globalEnv } = useMemo(() => {
    const globalEnv = envs.find((env) => env.id === "global");
    const activeEnv = envs.find((env) => env.id === activeEnvId);
    return { globalEnv, activeEnv };
  }, [envs, activeEnvId]);

  useEffect(() => {
    if (value !== state.inputValue) dispatch({ type: "SYNC_VALUE", payload: value });
  }, [value, state.inputValue]);

  const availableVariables = useMemo(() => createAvailableVariables(globalEnv, activeEnv), [activeEnv, globalEnv]);

  const variableMap = useMemo(() => createVariablesMap(availableVariables), [availableVariables]);

  const resolveVariablesFn = useCallback((text: string) => resolveVariables(variableMap, text), [variableMap]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart || 0;

    dispatch({ type: "SET_INPUT_VALUE", payload: newValue });
    onResolvedChange?.(resolveVariablesFn(newValue));
    onRawValueChange(newValue);

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

      if (onResolvedChange) {
        const resolved = resolveVariablesFn(newValue);
        onResolvedChange(resolved);
      }

      onRawValueChange(newValue);
      dispatch({ type: "HIDE_SUGGESTIONS" });

      setTimeout(() => {
        const newCursorPos = lastDoubleBracket + variable.length + 4;
        inputRef.current?.setSelectionRange(newCursorPos, newCursorPos);
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
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
    [state.inputValue, variableMap, extractVariables],
  );

  const handleMouseLeave = useCallback(() => {
    dispatch({ type: "SET_TOOLTIP", payload: null });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && !inputRef.current?.contains(event.target as Node))
        dispatch({ type: "HIDE_SUGGESTIONS" });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="relative">
        <Input ref={inputRef} value={state.inputValue} onChange={handleInputChange} {...otherProps} />
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
          style={{ top: state.suggestionPosition.top, left: state.suggestionPosition.left }}
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
                            ? "bg-blue-100 text-blue-700 border border-blue-300"
                            : "bg-green-100 text-green-700 border border-green-300"
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
};

export default UltimateInput;
