import axios from "axios";
import type { ApiErrorBody } from "@/types/api";

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.message || fallbackMessage;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

export function getApiErrorDetailMessage(
  error: unknown,
  fallbackMessage: string,
) {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const result = error.response?.data?.result;

    if (typeof result === "string" && result.trim()) {
      return result;
    }
  }

  return getApiErrorMessage(error, fallbackMessage);
}

export function isUnauthorizedError(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

export function isRetryableError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;
  return status === undefined || status >= 500;
}
