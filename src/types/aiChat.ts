export type AiSenderType = "USER" | "AI";

export type AiAnswerStatus =
  | "GREETING"
  | "ANSWERED"
  | "LINK_GUIDANCE"
  | "REGION_REQUIRED"
  | "NO_EVIDENCE";

export type AiSourceType = "INFO" | "NEWS" | "SITE";
export type AiFeedbackType = "HELPFUL" | "INCORRECT";

export type AiFeedbackReason =
  | "TIME"
  | "ELIGIBILITY"
  | "BENEFIT"
  | "INSTITUTION_INFO"
  | "ETC";

export type AiTermsAgreement = {
  aiTermsAgreed: boolean;
  agreedAt: string | null;
};

export type AiChatRoom = {
  aiChatRoomId: number;
  createdAt: string;
  showGuideModal: boolean;
  hasTodayMessages: boolean;
  hasPreviousMessages: boolean;
};

export type AiChatStarter = {
  greeting: string;
  suggestedQuestions: string[];
};

export type AiGuideConfirmation = {
  lastGuideConfirmedAt: string;
};

export type AiTermsContent = {
  type: string;
  title: string;
  content: string;
  updatedAt: string;
};

export type AiMessageSource = {
  sourceType: AiSourceType;
  sourceId: number;
  sourceTitle: string;
  sourceUrl: string;
  updatedAt: string | null;
};

export type AiMessage = {
  aiMessageId: number;
  senderType: AiSenderType;
  answerStatus: AiAnswerStatus | null;
  content: string;
  createdAt: string;
  sources: AiMessageSource[];
  feedback: {
    aiFeedbackId: number;
    feedbackType: AiFeedbackType;
    reasons: AiFeedbackReason[] | null;
  } | null;
  warning?: {
    type: "INCORRECT_SOURCE";
    message: string;
  } | null;
};

export type AiMessageCursor = {
  id: number;
  createdAt: string;
};

export type AiMessagePage = {
  messages: AiMessage[];
  nextCursor: AiMessageCursor | null;
  hasNext: boolean;
};

export type AiHistoryDateGroup = {
  date: string;
  items: AiMessage[];
};

export type AiHistoryPage = {
  messages: AiHistoryDateGroup[];
  nextCursor: AiMessageCursor | null;
  hasNext: boolean;
};

export type CreateAiFeedbackRequest = {
  feedbackType: AiFeedbackType;
  reasons?: AiFeedbackReason[];
};

export type CreateAiFeedbackResponse = {
  aiFeedbackId: number;
  feedbackType: AiFeedbackType;
  reasons: AiFeedbackReason[] | null;
};

export type AiCurationResource = {
  title: string;
  url?: string;
};

export type UserMessage = {
  id: number;
  role: "user";
  text: string;
};

export type BotMessage = {
  id: number;
  serverId?: number;
  role: "bot";
  answerStatus?: AiAnswerStatus | null;
  text: string;
  resources?: AiCurationResource[];
  warning?: string | null;
  suggestions?: string[];
};

export type LoadingMessage = {
  id: number;
  role: "loading";
};

export type ChatMessage = UserMessage | BotMessage | LoadingMessage;

export type HistorySection = {
  date: string;
  dateTime: string;
  messages: ChatMessage[];
};
