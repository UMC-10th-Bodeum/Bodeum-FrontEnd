type ApiErrorLike = {
  code?: unknown;
  isAxiosError?: unknown;
  response?: {
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
