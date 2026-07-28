export type NextStep = "TERMS" | "ONBOARDING" | "HOME";

export type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};
