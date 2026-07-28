import type { ProfileSettingsForm } from "./types";

export const initialProfileSettings: ProfileSettingsForm = {
  parentNickname: "보듬 부모님",
  region: "서울특별시",
  district: "강남구",
  childNickname: "보듬 부모님",
  birthYear: "",
  birthMonth: "",
  diagnoses: ["AUTISM"],
};

export const birthYearOptions = Array.from({ length: 27 }, (_, index) => {
  const year = String(2026 - index);
  return { label: `${year}년`, value: year };
});

export const birthMonthOptions = Array.from({ length: 12 }, (_, index) => {
  const month = String(index + 1);
  return { label: `${month}월`, value: month };
});
