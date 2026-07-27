import type { VariableMatch } from "./tokenizeText";

export type InputFontMetrics = {
  font: string;
  letterSpacing: string;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  borderLeft: number;
  borderTop: number;
  lineHeight: number;
};

export const readInputFontMetrics = (input: HTMLInputElement): InputFontMetrics => {
  const style = window.getComputedStyle(input);
  return {
    font: style.font,
    letterSpacing: style.letterSpacing,
    paddingLeft: parseFloat(style.paddingLeft) || 0,
    paddingRight: parseFloat(style.paddingRight) || 0,
    paddingTop: parseFloat(style.paddingTop) || 0,
    borderLeft: parseFloat(style.borderLeftWidth) || 0,
    borderTop: parseFloat(style.borderTopWidth) || 0,
    lineHeight: parseFloat(style.lineHeight) || input.offsetHeight,
  };
};

let measureCanvas: HTMLCanvasElement | null = null;

export const measureTextWidth = (text: string, font: string, letterSpacing = "normal"): number => {
  if (typeof document === "undefined") return text.length * 8;

  if (!measureCanvas) measureCanvas = document.createElement("canvas");
  const ctx = measureCanvas.getContext("2d");
  if (!ctx) return text.length * 8;

  ctx.font = font;
  const base = ctx.measureText(text).width;

  if (!letterSpacing || letterSpacing === "normal") return base;

  const spacing = parseFloat(letterSpacing);
  if (Number.isNaN(spacing) || text.length <= 1) return base;

  return base + spacing * (text.length - 1);
};

export type CaretCoordinates = { top: number; left: number; height: number };

/** Viewport coordinates of the caret inside an `<input>`. */
export const getCaretCoordinates = (input: HTMLInputElement, position: number): CaretCoordinates => {
  const metrics = readInputFontMetrics(input);
  const rect = input.getBoundingClientRect();
  const textBefore = input.value.substring(0, position);
  const textWidth = measureTextWidth(textBefore, metrics.font, metrics.letterSpacing);
  const left = rect.left + metrics.borderLeft + metrics.paddingLeft + textWidth - input.scrollLeft;
  const top = rect.top + metrics.borderTop + metrics.paddingTop;

  return {
    top,
    left,
    height: metrics.lineHeight,
  };
};

export type TokenHit = VariableMatch & {
  startX: number;
  endX: number;
  centerX: number;
};

/**
 * Map a mouse X (client) to a variable token under the cursor.
 * `contentX` is distance from the start of the text content (padding + scroll accounted for).
 */
export const findTokenAtContentX = (
  text: string,
  variables: VariableMatch[],
  contentX: number,
  font: string,
  letterSpacing = "normal",
): TokenHit | null => {
  for (const variable of variables) {
    const startX = measureTextWidth(text.slice(0, variable.start), font, letterSpacing);
    const endX = measureTextWidth(text.slice(0, variable.end), font, letterSpacing);
    if (contentX >= startX && contentX < endX) {
      return {
        ...variable,
        startX,
        endX,
        centerX: (startX + endX) / 2,
      };
    }
  }
  return null;
};

export const clientXToContentX = (input: HTMLInputElement, clientX: number): number => {
  const metrics = readInputFontMetrics(input);
  const rect = input.getBoundingClientRect();
  return clientX - rect.left - metrics.borderLeft - metrics.paddingLeft + input.scrollLeft;
};

export const clampSuggestionPosition = (
  top: number,
  left: number,
  menuWidth: number,
  menuHeight: number,
): { top: number; left: number } => {
  const padding = 8;
  const maxLeft = window.innerWidth - menuWidth - padding;
  const maxTop = window.innerHeight - menuHeight - padding;

  return {
    top: Math.max(padding, Math.min(top, maxTop)),
    left: Math.max(padding, Math.min(left, maxLeft)),
  };
};
