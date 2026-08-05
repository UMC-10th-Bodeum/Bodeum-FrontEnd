import type { InternalAxiosRequestConfig } from "axios";

export type NextStep = "TERMS" | "ONBOARDING" | "HOME";

export type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export type ApiErrorBody = {
  message?: string;
};

export interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
