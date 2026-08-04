import axios from "axios";

type ApiErrorBody = {
  message?: string;
  result?: unknown;
};

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.message || fallbackMessage;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

export function getApiErrorDetailMessage(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const result = error.response?.data?.result;

    if (typeof result === "string" && result.trim()) {
      return result;
    }
  }

  return getApiErrorMessage(error, fallbackMessage);
}
