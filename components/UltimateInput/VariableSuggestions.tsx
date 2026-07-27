import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Variable } from "@/types/variables.type";
import { FC, RefObject } from "react";
import { createPortal } from "react-dom";

interface VariableSuggestionsProps {
  variables: Variable[];
  position: { top: number; left: number };
  selectedIndex: number;
  onSelect: (variable: string) => void;
  dropdownRef: RefObject<HTMLDivElement | null>;
}

const VariableSuggestions: FC<VariableSuggestionsProps> = ({
  variables,
  position,
  selectedIndex,
  onSelect,
  dropdownRef,
}) => {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={dropdownRef}
      className="fixed z-[200] w-72 rounded-md border bg-popover text-popover-foreground shadow-md"
      style={{ top: position.top, left: position.left }}
    >
      <Command className="rounded-md" shouldFilter={false}>
        <CommandList className="max-h-64">
          {variables.length === 0 ? (
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">No variables found</CommandEmpty>
          ) : (
            <CommandGroup>
              {variables.map((v, idx) => (
                <CommandItem
                  key={`${v.source}-${v.variable}-${idx}`}
                  value={`${v.variable}-${v.source}-${idx}`}
                  onSelect={() => onSelect(v.variable)}
                  data-selected={idx === selectedIndex}
                  className={`flex cursor-pointer items-center gap-2 px-3 py-2 ${
                    idx === selectedIndex ? "bg-accent text-accent-foreground" : ""
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold ${
                      v.source === "Global"
                        ? "border border-blue-300 bg-blue-100 text-blue-700"
                        : "border border-green-300 bg-green-100 text-green-700"
                    }`}
                  >
                    {v.source === "Global" ? "G" : "E"}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium">{v.variable}</span>
                    <span className="truncate text-xs text-muted-foreground">{v.value}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>,
    document.body,
  );
};

export default VariableSuggestions;
