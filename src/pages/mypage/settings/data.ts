import type { ProfileSettingsForm } from "./types";

export const initialProfileSettings: ProfileSettingsForm = {
  parentNickname: "보듬 부모님",
  region: "서울특별시",
  district: "강남구",
  childNickname: "보듬 부모님",
  birthYear: "2021",
  birthMonth: "4",
  diagnoses: ["AUTISM"],
};

const currentYear = new Date().getFullYear();

export const birthYearOptions = Array.from({ length: 27 }, (_, index) => {
  const year = String(currentYear - index);
  return { label: `${year}년`, value: year };
});

export const birthMonthOptions = Array.from({ length: 12 }, (_, index) => {
  const month = String(index + 1);
  return { label: `${month}월`, value: month };
});
