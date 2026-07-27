"use client";

import { useEnvStore } from "@/store/useEnvStore";
import { ComponentProps, FC, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Input } from "../ui/input";
import {
  createAvailableVariables,
  createVariablesMap,
  initialVariableInputState,
  reducer,
  resolveVariables,
} from "@/lib/variables/envToVariableHandler";
import { extractVariables, filterVariables, getOpenVariableTrigger } from "@/lib/variables/tokenizeText";
import {
  clampSuggestionPosition,
  clientXToContentX,
  findTokenAtContentX,
  getCaretCoordinates,
  readInputFontMetrics,
} from "@/lib/variables/textMeasure";
import { cn } from "@/lib/utils";
import VariableHighlight from "./VariableHighlight";
import VariableSuggestions from "./VariableSuggestions";
import VariableTooltip from "./VariableTooltip";

interface UltimateInputProps extends Omit<ComponentProps<"input">, "value" | "onChange"> {
  onResolvedChange?: (resolvedValue: string) => void;
  onRawValueChange: (rawValue: string) => void;
  value: string;
}

const MENU_WIDTH = 288;
const MENU_HEIGHT = 256;

const UltimateInput: FC<UltimateInputProps> = ({
  onResolvedChange,
  onRawValueChange,
  className,
  onKeyDown,
  onScroll,
  onBlur,
  onFocus,
  ...props
}) => {
  const { ref: outputRef, value, ...otherProps } = props;

  const [state, dispatch] = useReducer(reducer, value, initialVariableInputState);
  const [scrollLeft, setScrollLeft] = useState(0);

  const insideRef = useRef<HTMLInputElement>(null);
  const inputRef = (outputRef ?? insideRef) as React.RefObject<HTMLInputElement | null>;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { envs, activeEnvId } = useEnvStore(
    useShallow((s) => ({ envs: s.envs, activeEnvId: s.activeEnvId })),
  );

  const { activeEnv, globalEnv } = useMemo(() => {
    const globalEnv = envs.find((env) => env.id === "global");
    const activeEnv = envs.find((env) => env.id === activeEnvId);
    return { globalEnv, activeEnv };
  }, [envs, activeEnvId]);

  useEffect(() => {
    if (value !== state.inputValue) dispatch({ type: "SYNC_VALUE", payload: value });
  }, [value, state.inputValue]);

  const availableVariables = useMemo(
    () => createAvailableVariables(globalEnv, activeEnv),
    [activeEnv, globalEnv],
  );

  const variableMap = useMemo(() => createVariablesMap(availableVariables), [availableVariables]);

  const resolveVariablesFn = useCallback(
    (text: string) => resolveVariables(variableMap, text),
    [variableMap],
  );

  const filteredVariables = useMemo(
    () => filterVariables(availableVariables, state.filterText),
    [availableVariables, state.filterText],
  );

  const showSuggestionsAtCursor = useCallback(
    (text: string, cursorPos: number) => {
      const trigger = getOpenVariableTrigger(text, cursorPos);
      const input = inputRef.current;
      if (!trigger || !input) {
        dispatch({ type: "HIDE_SUGGESTIONS" });
        return;
      }

      const caret = getCaretCoordinates(input, trigger.start + 2);
      const position = clampSuggestionPosition(
        caret.top + caret.height + 4,
        caret.left,
        MENU_WIDTH,
        MENU_HEIGHT,
      );

      dispatch({
        type: "SHOW_SUGGESTIONS",
        payload: {
          position,
          filterText: trigger.filterText,
          cursorPosition: cursorPos,
        },
      });
    },
    [inputRef],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart ?? 0;

    dispatch({ type: "SET_INPUT_VALUE", payload: newValue });
    onResolvedChange?.(resolveVariablesFn(newValue));
    onRawValueChange(newValue);
    setScrollLeft(e.target.scrollLeft);

    showSuggestionsAtCursor(newValue, cursorPos);
  };

  const handleSelectVariable = useCallback(
    (variable: string) => {
      const currentValue = state.inputValue;
      const cursorPos = state.cursorPosition;
      const beforeCursor = currentValue.substring(0, cursorPos);
      const afterCursor = currentValue.substring(cursorPos);
      const lastDoubleBracket = beforeCursor.lastIndexOf("<<");

      if (lastDoubleBracket === -1) return;

      const before = currentValue.substring(0, lastDoubleBracket);
      const newValue = `${before}<<${variable}>>${afterCursor}`;

      dispatch({ type: "SET_INPUT_VALUE", payload: newValue });
      onResolvedChange?.(resolveVariablesFn(newValue));
      onRawValueChange(newValue);
      dispatch({ type: "HIDE_SUGGESTIONS" });

      requestAnimationFrame(() => {
        const newCursorPos = lastDoubleBracket + variable.length + 4;
        inputRef.current?.focus();
        inputRef.current?.setSelectionRange(newCursorPos, newCursorPos);
      });
    },
    [state.inputValue, state.cursorPosition, resolveVariablesFn, onResolvedChange, onRawValueChange, inputRef],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (state.showSuggestions) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        dispatch({
          type: "SET_SELECTED_INDEX",
          payload: filteredVariables.length === 0 ? 0 : (state.selectedIndex + 1) % filteredVariables.length,
        });
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        dispatch({
          type: "SET_SELECTED_INDEX",
          payload:
            filteredVariables.length === 0
              ? 0
              : (state.selectedIndex - 1 + filteredVariables.length) % filteredVariables.length,
        });
        return;
      }

      if (e.key === "Enter" || e.key === "Tab") {
        const selected = filteredVariables[state.selectedIndex];
        if (selected) {
          e.preventDefault();
          handleSelectVariable(selected.variable);
          return;
        }
      }

      if (e.key === "Escape") {
        e.preventDefault();
        dispatch({ type: "HIDE_SUGGESTIONS" });
        return;
      }
    }

    onKeyDown?.(e);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input || !state.inputValue) {
        dispatch({ type: "SET_TOOLTIP", payload: null });
        return;
      }

      const metrics = readInputFontMetrics(input);
      const contentX = clientXToContentX(input, e.clientX);
      const variables = extractVariables(state.inputValue);
      const hit = findTokenAtContentX(
        state.inputValue,
        variables,
        contentX,
        metrics.font,
        metrics.letterSpacing,
      );

      if (!hit) {
        dispatch({ type: "SET_TOOLTIP", payload: null });
        return;
      }

      const resolved = variableMap.get(hit.name);
      if (!resolved) {
        dispatch({ type: "SET_TOOLTIP", payload: null });
        return;
      }

      const rect = input.getBoundingClientRect();
      const tokenCenterViewport =
        rect.left + metrics.borderLeft + metrics.paddingLeft + hit.centerX - input.scrollLeft;

      dispatch({
        type: "SET_TOOLTIP",
        payload: {
          name: hit.name,
          value: resolved,
          x: tokenCenterViewport,
          y: rect.bottom,
        },
      });
    },
    [state.inputValue, variableMap, inputRef],
  );

  const handleMouseLeave = useCallback(() => {
    dispatch({ type: "SET_TOOLTIP", payload: null });
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLInputElement>) => {
    setScrollLeft(e.currentTarget.scrollLeft);
    onScroll?.(e);
  };

  const syncSuggestionsFromCursor = () => {
    const input = inputRef.current;
    if (!input) return;
    showSuggestionsAtCursor(state.inputValue, input.selectionStart ?? 0);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      state.showSuggestions &&
      (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === "Escape" || e.key === "Tab")
    ) {
      return;
    }
    syncSuggestionsFromCursor();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current?.contains(target) || inputRef.current?.contains(target)) return;
      dispatch({ type: "HIDE_SUGGESTIONS" });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputRef]);

  useEffect(() => {
    if (!state.showSuggestions || !inputRef.current) return;

    const updatePosition = () => {
      const input = inputRef.current;
      if (!input) return;
      const trigger = getOpenVariableTrigger(state.inputValue, state.cursorPosition);
      if (!trigger) return;

      const caret = getCaretCoordinates(input, trigger.start + 2);
      const position = clampSuggestionPosition(
        caret.top + caret.height + 4,
        caret.left,
        MENU_WIDTH,
        MENU_HEIGHT,
      );
      dispatch({ type: "UPDATE_SUGGESTION_POSITION", payload: position });
    };

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [state.showSuggestions, state.inputValue, state.cursorPosition, inputRef]);

  useEffect(() => {
    if (state.selectedIndex >= filteredVariables.length) {
      dispatch({
        type: "SET_SELECTED_INDEX",
        payload: Math.max(0, filteredVariables.length - 1),
      });
    }
  }, [filteredVariables.length, state.selectedIndex]);

  return (
    <div className="relative w-full">
      <div className="relative" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <VariableHighlight
          value={state.inputValue}
          variableMap={variableMap}
          scrollLeft={scrollLeft}
          className={className}
        />
        <Input
          ref={inputRef}
          value={state.inputValue}
          autoComplete="off"
          spellCheck={false}
          {...otherProps}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onClick={syncSuggestionsFromCursor}
          onSelect={syncSuggestionsFromCursor}
          onScroll={handleScroll}
          onFocus={onFocus}
          onBlur={onBlur}
          className={cn(
            "relative z-10 bg-transparent text-transparent caret-foreground dark:bg-transparent",
            className,
          )}
        />
      </div>

      {state.tooltip && <VariableTooltip tooltip={state.tooltip} />}

      {state.showSuggestions && (
        <VariableSuggestions
          variables={filteredVariables}
          position={state.suggestionPosition}
          selectedIndex={state.selectedIndex}
          onSelect={handleSelectVariable}
          dropdownRef={dropdownRef}
        />
      )}
    </div>
  );
};

export default UltimateInput;
