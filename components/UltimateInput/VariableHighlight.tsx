import { tokenizeText } from "@/lib/variables/tokenizeText";
import { cn } from "@/lib/utils";
import { FC, useMemo } from "react";

interface VariableHighlightProps {
  value: string;
  variableMap: Map<string, string>;
  scrollLeft: number;
  className?: string;
}

const VariableHighlight: FC<VariableHighlightProps> = ({ value, variableMap, scrollLeft, className }) => {
  const segments = useMemo(() => tokenizeText(value), [value]);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-0 flex items-center overflow-hidden whitespace-pre rounded-md border border-transparent px-3 py-1 text-base md:text-sm",
        className,
      )}
    >
      <div className="min-w-full" style={{ transform: `translateX(-${scrollLeft}px)` }}>
        {segments.length === 0 ? (
          <span>&nbsp;</span>
        ) : (
          segments.map((segment, index) => {
            if (segment.type === "plain") {
              return (
                <span key={index} className="text-foreground">
                  {segment.text}
                </span>
              );
            }

            const known = variableMap.has(segment.name);
            return (
              <span key={index} className={known ? "text-amber-500" : "text-red-500"}>
                {segment.text}
              </span>
            );
          })
        )}
      </div>
    </div>
  );
};

export default VariableHighlight;
