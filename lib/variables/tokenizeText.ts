export type VariableMatch = {
  name: string;
  start: number;
  end: number;
};

export type TextSegment =
  | { type: "plain"; text: string; start: number; end: number }
  | { type: "variable"; text: string; name: string; start: number; end: number };

const VARIABLE_REGEX = /<<([^>]+)>>/g;

export const extractVariables = (text: string): VariableMatch[] => {
  const matches: VariableMatch[] = [];
  const regex = new RegExp(VARIABLE_REGEX.source, "g");
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    matches.push({
      name: match[1],
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return matches;
};

export const tokenizeText = (text: string): TextSegment[] => {
  const segments: TextSegment[] = [];
  const regex = new RegExp(VARIABLE_REGEX.source, "g");
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "plain",
        text: text.slice(lastIndex, match.index),
        start: lastIndex,
        end: match.index,
      });
    }

    segments.push({
      type: "variable",
      text: match[0],
      name: match[1],
      start: match.index,
      end: match.index + match[0].length,
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({
      type: "plain",
      text: text.slice(lastIndex),
      start: lastIndex,
      end: text.length,
    });
  }

  return segments;
};

/** Detect open `<<filter` before cursor (no closing `>>` yet). */
export const getOpenVariableTrigger = (
  text: string,
  cursorPosition: number,
): { start: number; filterText: string } | null => {
  const beforeCursor = text.substring(0, cursorPosition);
  const lastDoubleBracket = beforeCursor.lastIndexOf("<<");
  if (lastDoubleBracket === -1) return null;

  const afterBracket = text.substring(lastDoubleBracket + 2, cursorPosition);
  if (afterBracket.includes(">>")) return null;

  return { start: lastDoubleBracket, filterText: afterBracket };
};

export const filterVariables = <T extends { variable: string }>(items: T[], filterText: string): T[] => {
  if (!filterText) return items;
  const lower = filterText.toLowerCase();
  return items.filter((v) => v.variable.toLowerCase().includes(lower));
};
