import type { NewsStatus } from "@/types/news";

type NewsStatusVariant = "default" | "dday" | "recruit";

interface NewsStatusPresentation {
  label: string;
  variant: NewsStatusVariant;
}

const statusPresentation: Record<
  NewsStatus | "NONE",
  NewsStatusPresentation
> = {
  RECRUITING: { label: "모집 중", variant: "recruit" },
  CLOSED: { label: "마감", variant: "default" },
  ALWAYS_OPEN: { label: "상시 모집", variant: "recruit" },
  UPCOMING: { label: "모집 예정", variant: "default" },
  NONE: { label: "-", variant: "default" },
};

const millisecondsPerDay = 24 * 60 * 60 * 1000;
const seoulDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function getSeoulDateValue(date: Date) {
  const parts = seoulDateFormatter.formatToParts(date);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);

  return Date.UTC(year, month - 1, day);
}

function calculateRemainingDays(applyEndDate: string, today: Date) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(applyEndDate);

  if (!match) {
    return null;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const endDateValue = Date.UTC(year, month - 1, day);
  const parsedEndDate = new Date(endDateValue);

  if (
    parsedEndDate.getUTCFullYear() !== year ||
    parsedEndDate.getUTCMonth() !== month - 1 ||
    parsedEndDate.getUTCDate() !== day
  ) {
    return null;
  }

  return Math.round((endDateValue - getSeoulDateValue(today)) / millisecondsPerDay);
}

export function getNewsStatusPresentation(
  status: NewsStatus | null | undefined,
  applyEndDate: string | null | undefined,
  today = new Date(),
): NewsStatusPresentation {
  if (status === "RECRUITING" && applyEndDate) {
    const remainingDays = calculateRemainingDays(applyEndDate, today);

    if (remainingDays !== null && remainingDays >= 0) {
      return {
        label: remainingDays === 0 ? "D-Day" : `D-${remainingDays}`,
        variant: "dday",
      };
    }
  }

  return statusPresentation[status ?? "NONE"];
}
