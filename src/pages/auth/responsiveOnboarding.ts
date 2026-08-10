type ResponsiveScaleInput = {
  availableWidth: number;
  availableHeight: number;
  contentWidth: number;
  contentHeight: number;
};

export function calculateResponsiveScale({
  availableWidth,
  availableHeight,
  contentWidth,
  contentHeight,
}: ResponsiveScaleInput) {
  if (
    availableWidth <= 0 ||
    availableHeight <= 0 ||
    contentWidth <= 0 ||
    contentHeight <= 0
  ) {
    return 1;
  }

  return Math.min(
    1,
    availableWidth / contentWidth,
    availableHeight / contentHeight,
  );
}
