const CHILD_BIRTH_YEAR_START = 1990;

export function createChildBirthYearOptions() {
  const currentYear = new Date().getFullYear();

  return Array.from(
    { length: currentYear - CHILD_BIRTH_YEAR_START + 1 },
    (_, index) => {
      const year = CHILD_BIRTH_YEAR_START + index;

      return {
        label: `${year}년`,
        value: `${year}`,
      };
    },
  );
}

export function createChildBirthMonthOptions() {
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;

    return {
      label: `${month}월`,
      value: `${month}`,
    };
  });
}
