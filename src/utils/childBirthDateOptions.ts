const MAX_CHILD_AGE = 18;

export function createChildBirthYearOptions() {
  const currentYear = new Date().getFullYear();
  const birthYearStart = currentYear - MAX_CHILD_AGE;

  return Array.from({ length: MAX_CHILD_AGE + 1 }, (_, index) => {
    const year = birthYearStart + index;

    return {
      label: `${year}년`,
      value: `${year}`,
    };
  });
}

export function createChildBirthMonthOptions(birthYear = "") {
  const today = new Date();
  const currentYear = today.getFullYear();
  const lastMonth = birthYear === `${currentYear}` ? today.getMonth() + 1 : 12;

  return Array.from({ length: lastMonth }, (_, index) => {
    const month = index + 1;

    return {
      label: `${month}월`,
      value: `${month}`,
    };
  });
}
