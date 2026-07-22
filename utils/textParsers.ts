export function normalizeVisibleTexts(textValues: string[]): string[] {
  return textValues
    .map((value) => value.replace(/\u2013/g, '-').replace(/\u2026/g, '...').trim())
    .filter(Boolean);
}