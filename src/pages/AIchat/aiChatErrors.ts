type ApiErrorLike = {
  code?: unknown;
  isAxiosError?: unknown;
  response?: {
    status?: unknown;
    data?: {
      code?: unknown;
    };
  };
};

export function getAiChatErrorCode(error: unknown) {
  if (typeof error !== "object" || error === null) return undefined;

  const code = (error as ApiErrorLike).response?.data?.code;
  return typeof code === "string" ? code : undefined;
}

export function isAiTermsNotAgreedError(error: unknown) {
  return getAiChatErrorCode(error) === "AI403_1";
}

export function isAiChatRoomNotFoundError(error: unknown) {
  if (typeof error !== "object" || error === null) return false;

  const response = (error as ApiErrorLike).response;
  return response?.status === 404 && getAiChatErrorCode(error) === "AI404_1";
}

export function isAiChatRoomConflictError(error: unknown) {
  if (typeof error !== "object" || error === null) return false;

  const response = (error as ApiErrorLike).response;
  return response?.status === 409 && getAiChatErrorCode(error) === "AI409_1";
}

export function isAiChatTransportUncertainError(error: unknown) {
  if (typeof error !== "object" || error === null) return false;

  const candidate = error as ApiErrorLike;
  if (candidate.response !== undefined) return false;

  return (
    candidate.isAxiosError === true ||
    candidate.code === "ECONNABORTED" ||
    candidate.code === "ETIMEDOUT" ||
    candidate.code === "ERR_NETWORK"
  );
}
