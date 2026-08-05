import type { ApiResponse } from "./apiTypes";

export function getSuccessfulResult<T>(response: ApiResponse<T>) {
  if (!response.isSuccess) {
    throw new Error(response.message || "요청을 처리하지 못했습니다.");
  }

  return response.result;
}
