export function normalizeOptionIndex(
  index: number | undefined,
  optionCount: number,
) {
  if (optionCount <= 0) {
    return 0;
  }

  const normalizedIndex =
    typeof index === "number" && Number.isFinite(index) ? Math.floor(index) : 0;

  return Math.min(Math.max(normalizedIndex, 0), optionCount - 1);
}
