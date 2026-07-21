export type NewsSourceTab = "activity" | "region";

export const newsSourceTabs = [
  { value: "activity", label: "활동소식" },
  { value: "region", label: "지역소식" },
] as const satisfies readonly { value: NewsSourceTab; label: string }[];

export const isNewsSourceTab = (value: string | undefined): value is NewsSourceTab =>
  value === "activity" || value === "region";
