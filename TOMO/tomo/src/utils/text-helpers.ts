/**
 * text-helpers — Shared text utility functions.
 */

export interface TextSegment {
  text: string;
  bold: boolean;
}

/**
 * Parse a string with **bold** markers into an array of TextSegment objects.
 * Bold segments have bold: true. Everything else is bold: false.
 *
 * Example:
 *   parseBold("Work on your **guard retention** this week.")
 *   => [
 *        { text: "Work on your ", bold: false },
 *        { text: "guard retention", bold: true },
 *        { text: " this week.", bold: false },
 *      ]
 */
export function parseBold(input: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: input.slice(lastIndex, match.index), bold: false });
    }
    segments.push({ text: match[1], bold: true });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < input.length) {
    segments.push({ text: input.slice(lastIndex), bold: false });
  }

  return segments.length > 0 ? segments : [{ text: input, bold: false }];
}
