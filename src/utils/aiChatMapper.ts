import type {
  AiChatStarter,
  AiCurationResource,
  AiFeedbackType,
  AiMessage,
  AiMessageSource,
  BotMessage,
  ChatMessage,
} from "@/types/aiChat";

export function mapSourceToResource(
  source: AiMessageSource | undefined,
): AiCurationResource | null {
  if (!source) return null;

  return {
    title: source.sourceTitle,
    url: source.sourceUrl,
  };
}

export function mapApiMessage(
  message: AiMessage,
  suggestions?: string[],
): ChatMessage {
  if (message.senderType === "USER") {
    return {
      id: message.aiMessageId,
      role: "user",
      text: message.content,
    };
  }

  return {
    id: message.aiMessageId,
    serverId: message.aiMessageId,
    role: "bot",
    text: message.content,
    resources: message.sources
      .map(mapSourceToResource)
      .filter((resource): resource is AiCurationResource => resource !== null),
    warning: message.warning?.message ?? null,
    suggestions,
  };
}

export function mapStarterMessage(starter: AiChatStarter): BotMessage {
  return {
    id: 0,
    role: "bot",
    text: starter.greeting,
    resources: [],
    suggestions: starter.suggestedQuestions,
  };
}

export function deduplicateMessages(messages: AiMessage[]) {
  return Array.from(
    new Map(messages.map((message) => [message.aiMessageId, message])).values(),
  ).sort(
    (left, right) =>
      new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
  );
}

export function mapCurrentSessionMessages(
  messages: AiMessage[],
  starter: AiChatStarter,
) {
  const hasPersistedGreeting = messages.some(
    (message) =>
      message.senderType === "AI" && message.answerStatus === "GREETING",
  );

  const mappedMessages = messages.map((message) =>
    mapApiMessage(
      message,
      message.senderType === "AI" && message.answerStatus === "GREETING"
        ? starter.suggestedQuestions
        : undefined,
    ),
  );

  return hasPersistedGreeting
    ? mappedMessages
    : [mapStarterMessage(starter), ...mappedMessages];
}

export function collectFeedbackByMessage(messages: AiMessage[]) {
  return messages.reduce<Record<number, AiFeedbackType>>(
    (feedbackByMessage, message) => {
      if (message.feedback) {
        feedbackByMessage[message.aiMessageId] = message.feedback.feedbackType;
      }

      return feedbackByMessage;
    },
    {},
  );
}
