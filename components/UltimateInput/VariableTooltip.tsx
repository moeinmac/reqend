import { VariableTooltip as TooltipState } from "@/types/variables.type";
import { FC } from "react";
import { createPortal } from "react-dom";

interface VariableTooltipProps {
  tooltip: TooltipState;
}

const VariableTooltip: FC<VariableTooltipProps> = ({ tooltip }) => {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="pointer-events-none fixed z-[200] max-w-xs break-all rounded bg-gray-900 px-3 py-2 text-xs text-white shadow-lg"
      style={{
        top: tooltip.y + 6,
        left: tooltip.x,
        transform: "translateX(-50%)",
      }}
    >
      <div className="text-gray-300">{tooltip.value}</div>
    </div>,
    document.body,
  );
};

export default VariableTooltip;
