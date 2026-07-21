import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import OnboardCancelBox from "@/components/OnboardCancelBox";
import { showToast } from "@/components/Toast";

import {
  AiCheckbox,
  AiChatPanel,
  AiChatStateSwitcher,
  AiMessageBot,
  AiMessageBubble,
  DateDivider,
  type AiCurationResource,
  type AiChatScenario,
  type AiInputVariant,
} from "./components";

const SUGGESTIONS = [
  "바우처 신청 방법 알려주세요",
  "강남구 재활센터 추천해줘",
  "자폐스펙트럼 지원 제도 요약",
  "장애 진단 후 첫 번째로 해야 할 일",
];

const MOCK_FOLLOW_UP_SUGGESTIONS = [
  "지원 대상도 알려주세요",
  "신청할 때 필요한 서류는 무엇인가요?",
  "비슷한 지원 제도도 찾아주세요",
];

type MockAuthState = {
  isLoggedIn: boolean;
  hasChatConsent: boolean;
  isFirstVisit: boolean;
};

const DEFAULT_MOCK_SCENARIO: AiChatScenario = "first-entry";

const MOCK_SCENARIO_STATE: Record<AiChatScenario, MockAuthState> = {
  "first-entry": {
    isLoggedIn: true,
    hasChatConsent: true,
    isFirstVisit: true,
  },
  "login-required": {
    isLoggedIn: false,
    hasChatConsent: true,
    isFirstVisit: true,
  },
  "consent-required": {
    isLoggedIn: true,
    hasChatConsent: false,
    isFirstVisit: false,
  },
};

type UserMessage = {
  id: number;
  role: "user";
  text: string;
};

type BotMessage = {
  id: number;
  role: "bot";
  text: string;
  resource?: AiCurationResource | null;
  suggestions?: string[];
};

type LoadingMessage = {
  id: number;
  role: "loading";
};

type ChatMessage = UserMessage | BotMessage | LoadingMessage;

const welcomeMessage: BotMessage = {
  id: 1,
  role: "bot",
  text: `안녕하세요! 저는 보듬 AI 큐레이션 입니다 😊

OO님의 정보를 바탕으로
복지 바우처, 재활 기관, 지원 제도 등 발달장애 아동 양육에 필요한 정보를 쉽고 빠르게 안내해드려요.

무엇이 궁금하신가요?`,
  resource: {
    title: "📌 2026 발달재활서비스 바우처 신청 안내 >",
    meta: "복지 정보 · D-7 · 서울 강남구",
  },
  suggestions: SUGGESTIONS,
};

const CHAT_RETENTION_DAYS = 7;

const historySections: Array<{
  date: string;
  dateTime: string;
  messages: ChatMessage[];
}> = [
  {
    date: "2026년 7월 10일 금요일",
    dateTime: "2026-07-10",
    messages: [
      {
        id: -20,
        role: "user",
        text: "장애 진단을 받은 뒤 가장 먼저 뭘 해야 해?",
      },
      {
        id: -19,
        role: "bot",
        text: `진단서와 검사 결과를 정리한 뒤 거주지 주민센터에서 장애 등록 절차를 확인해보세요.
이후 발달장애인지원센터에 상담을 신청하면 이용 가능한 복지 서비스를 함께 안내받을 수 있어요.`,
        resource: {
          title: "📌 장애 등록 및 복지 서비스 신청 순서 >",
          meta: "복지 정보 · 신청 절차",
        },
      },
    ],
  },
  {
    date: "2026년 7월 11일 토요일",
    dateTime: "2026-07-11",
    messages: [
      {
        id: -18,
        role: "user",
        text: "발달재활서비스 바우처 신청 조건이 궁금해",
      },
      {
        id: -17,
        role: "bot",
        text: `발달재활서비스는 연령과 장애 등록 여부, 가구 소득 등을 기준으로 지원 대상을 확인해요.
거주지 주민센터에서 현재 적용되는 기준과 필요한 서류를 확인해보세요.`,
        resource: {
          title: "📌 발달재활서비스 지원 대상 안내 >",
          meta: "복지 정보 · 보건복지부",
        },
      },
      {
        id: -16,
        role: "user",
        text: "신청할 때 필요한 서류도 알려줘",
      },
      {
        id: -15,
        role: "bot",
        text: `신분증, 소득 확인 자료, 발달재활서비스 의뢰서나 검사 자료 등이 필요할 수 있어요.
가구 상황에 따라 달라지므로 방문 전에 주민센터에 준비 서류를 확인해 주세요.`,
      },
    ],
  },
  {
    date: "2026년 7월 12일 일요일",
    dateTime: "2026-07-12",
    messages: [
      {
        id: -14,
        role: "user",
        text: "아이 돌봄 지원도 같이 받을 수 있어?",
      },
      {
        id: -13,
        role: "bot",
        text: `일부 돌봄 지원은 발달재활서비스와 함께 이용할 수 있어요.
다만 사업별 중복 지원 기준이 다르므로 신청 전에 관할 기관에 확인하는 것이 좋아요.`,
        resource: {
          title: "📌 장애아가족 양육지원사업 안내 >",
          meta: "돌봄 정보 · 여성가족부",
        },
      },
    ],
  },
  {
    date: "2026년 7월 13일 월요일",
    dateTime: "2026-07-13",
    messages: [
      {
        id: -12,
        role: "user",
        text: "감각통합치료 기관을 고를 때 뭘 봐야 해?",
      },
      {
        id: -11,
        role: "bot",
        text: `치료사의 자격과 경력, 초기 평가 방식, 보호자 상담 주기부터 확인해보세요.
아이의 목표를 구체적으로 설명하고 치료 계획을 함께 조정할 수 있는지도 중요해요.`,
        resource: {
          title: "📌 우리 아이에게 맞는 재활기관 찾기 >",
          meta: "기관 이용 정보 · 보듬",
        },
      },
      {
        id: -10,
        role: "user",
        text: "상담할 때 꼭 물어봐야 하는 것도 있어?",
      },
      {
        id: -9,
        role: "bot",
        text: `주당 치료 횟수와 회기 시간, 보호자 상담 방식, 대기 기간을 확인해보세요.
결석이나 일정 변경 시 보강 기준과 바우처 결제 방식도 미리 물어보는 것이 좋아요.`,
      },
    ],
  },
  {
    date: "2026년 7월 14일 화요일",
    dateTime: "2026-07-14",
    messages: [
      {
        id: -8,
        role: "user",
        text: "학교 방과 후 지원 프로그램 알려줘",
      },
      {
        id: -7,
        role: "bot",
        text: `학교와 지역 복지관에서 운영하는 방과 후 활동 및 돌봄 프로그램을 확인할 수 있어요.
학교 특수교육 담당자나 거주지 발달장애인지원센터에 먼저 문의해보세요.`,
        resource: {
          title: "📌 발달장애인 방과후활동서비스 안내 >",
          meta: "교육·돌봄 정보 · 신청 가능",
        },
      },
    ],
  },
  {
    date: "2026년 7월 15일 수요일",
    dateTime: "2026-07-15",
    messages: [
      {
        id: -6,
        role: "user",
        text: "강남구 재활센터 추천해줘",
      },
      {
        id: -5,
        role: "bot",
        text: `강남구에서 이용할 수 있는 재활 기관을 찾았어요.
아이의 연령과 필요한 치료 영역을 함께 확인한 뒤 기관에 문의해보세요.`,
        resource: {
          title: "📌 우리아이 발달지원센터 이용 안내 >",
          meta: "기관 정보 · 서울 강남구",
        },
      },
      {
        id: -4,
        role: "user",
        text: "언어치료가 가능한 곳 위주로 알려줘",
      },
      {
        id: -3,
        role: "bot",
        text: `언어재활사가 상주하고 초기 언어 평가를 제공하는 기관을 우선 확인해보세요.
기관마다 대상 연령과 대기 기간이 다르므로 전화 상담 후 방문 예약을 권장해요.`,
      },
      {
        id: -2,
        role: "user",
        text: "토요일에도 운영하는 기관이 있을까?",
      },
      {
        id: -1,
        role: "bot",
        text: `토요일에 운영하는 기관도 있지만 평일보다 치료 시간과 인원이 제한될 수 있어요.
희망 기관에 주말 운영 시간과 신규 접수 가능 여부를 먼저 확인해 주세요.`,
      },
    ],
  },
];

const retainedHistorySections = historySections.slice(
  -(CHAT_RETENTION_DAYS - 1),
);

const FEEDBACK_REASONS = [
  "신청 기간이나 운영 시간",
  "지원 대상(자격 요건)",
  "금액이나 혜택 내용",
  "전화번호나 위치 정보",
  "기타",
];

function CenteredModal({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {children}
    </div>
  );
}

function UserMessageRow({ text }: { text: string }) {
  return (
    <article className="flex w-full flex-col items-end justify-center gap-[16px] py-[12px]">
      <AiMessageBubble variant="user" message={text} />
    </article>
  );
}

export default function AIChatPage() {
  const navigate = useNavigate();
  const messagesRef = useRef<HTMLDivElement>(null);
  const historySectionRef = useRef<HTMLDivElement>(null);
  const todaySectionRef = useRef<HTMLDivElement>(null);
  const historyScrollAnimationRef = useRef<number | null>(null);
  const nextIdRef = useRef(2);
  const pendingTimers = useRef<Array<ReturnType<typeof window.setTimeout>>>([]);

  const [activeScenario, setActiveScenario] = useState<AiChatScenario>(
    DEFAULT_MOCK_SCENARIO,
  );
  const [authState, setAuthState] = useState<MockAuthState>(
    MOCK_SCENARIO_STATE[DEFAULT_MOCK_SCENARIO],
  );
  const [noticeChecked, setNoticeChecked] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistoryButton, setShowHistoryButton] = useState(true);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedFeedbackReasons, setSelectedFeedbackReasons] = useState<
    string[]
  >([]);

  const inputVariant: AiInputVariant = useMemo(() => {
    if (inputValue.includes("\n") || inputValue.length > 70) return "variant4";
    return inputValue.length > 0 ? "typing" : "default";
  }, [inputValue]);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [messages]);

  useEffect(() => {
    const timers = pendingTimers.current;

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      if (historyScrollAnimationRef.current !== null) {
        window.cancelAnimationFrame(historyScrollAnimationRef.current);
      }
    };
  }, []);

  const buildMockAnswer = (question: string): BotMessage => ({
    id: nextIdRef.current++,
    role: "bot",
    text: `“${question}”에 대해 확인한 내용을 안내해드릴게요.\n\n신청 대상과 지원 범위는 거주 지역과 아이의 연령에 따라 달라질 수 있어요. 아래 안내를 먼저 확인한 뒤, 관할 주민센터 또는 공식 기관에 최종 문의해 주세요.`,
    resource: {
      title: "📌 발달재활서비스 바우처 신청 안내 >",
      meta: "복지 정보 · 보건복지부 · 신청 가능",
    },
  });

  const handleSend = (preset?: string) => {
    const text = (preset ?? inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: UserMessage = {
      id: nextIdRef.current++,
      role: "user",
      text,
    };
    const loadingMessage: LoadingMessage = {
      id: nextIdRef.current++,
      role: "loading",
    };

    if (historyScrollAnimationRef.current !== null) {
      window.cancelAnimationFrame(historyScrollAnimationRef.current);
      historyScrollAnimationRef.current = null;
    }
    setShowHistoryButton(true);
    setInputValue("");
    setIsLoading(true);
    setMessages((current) => [...current, userMessage, loadingMessage]);

    const timer = window.setTimeout(() => {
      const answer = buildMockAnswer(text);
      setMessages((current) => [
        ...current.filter((message) => message.id !== loadingMessage.id),
        answer,
      ]);
      setIsLoading(false);
    }, 1400);

    pendingTimers.current.push(timer);
  };

  const handleScenarioChange = (scenario: AiChatScenario) => {
    setActiveScenario(scenario);
    setAuthState({ ...MOCK_SCENARIO_STATE[scenario] });
    setNoticeChecked(false);
    setConsentChecked(false);
    setFeedbackOpen(false);
    setSelectedFeedbackReasons([]);
  };

  const handleReturnToPrevious = () => {
    navigate(-1);
  };

  const getSectionTop = (section: HTMLDivElement | null) => {
    const messagesContainer = messagesRef.current;

    if (!messagesContainer || !section) return null;

    return (
      messagesContainer.scrollTop +
      section.getBoundingClientRect().top -
      messagesContainer.getBoundingClientRect().top
    );
  };

  const getHistorySectionTop = () =>
    getSectionTop(historySectionRef.current);

  const updateHistoryButtonVisibility = () => {
    const messagesContainer = messagesRef.current;
    const todaySectionTop = getSectionTop(todaySectionRef.current);

    if (!messagesContainer || todaySectionTop === null) {
      return;
    }

    const maxScrollTop =
      messagesContainer.scrollHeight - messagesContainer.clientHeight;
    const todayScrollBoundary = Math.min(todaySectionTop, maxScrollTop);
    const isViewingToday =
      messagesContainer.scrollTop >= todayScrollBoundary - 2;

    setShowHistoryButton(isViewingToday);
  };

  const handleHistoryClick = () => {
    const messagesContainer = messagesRef.current;
    const historySectionTop = getHistorySectionTop();

    if (!messagesContainer || historySectionTop === null) return;

    if (historyScrollAnimationRef.current !== null) {
      window.cancelAnimationFrame(historyScrollAnimationRef.current);
    }

    const startTop = messagesContainer.scrollTop;
    const distance = historySectionTop - startTop;
    const duration = 900;
    const startedAt = window.performance.now();

    const animateScroll = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4);

      messagesContainer.scrollTop = startTop + distance * easedProgress;

      if (progress < 1) {
        historyScrollAnimationRef.current =
          window.requestAnimationFrame(animateScroll);
        return;
      }

      messagesContainer.scrollTop = historySectionTop;
      historyScrollAnimationRef.current = null;
      updateHistoryButtonVisibility();
    };

    historyScrollAnimationRef.current =
      window.requestAnimationFrame(animateScroll);
  };

  const renderMessage = (message: ChatMessage) => {
    if (message.role === "user") {
      return <UserMessageRow key={message.id} text={message.text} />;
    }

    if (message.role === "loading") {
      return <AiMessageBot key={message.id} variant="loading" />;
    }

    return (
      <AiMessageBot
        key={message.id}
        message={message.text}
        resource={message.resource}
        suggestions={message.suggestions ?? MOCK_FOLLOW_UP_SUGGESTIONS}
        showFeedback
        onSuggestionClick={(suggestion) => handleSend(suggestion)}
        onBadFeedback={() => {
          setSelectedFeedbackReasons([]);
          setFeedbackOpen(true);
        }}
      />
    );
  };

  const entryModal = !authState.isLoggedIn ? (
    <CenteredModal>
      <OnboardCancelBox
        title="로그인하고 더 많은 기능을 이용해 보세요!"
        description={`회원가입 후 프로필을 등록하시면,\nAI 챗봇 질문, 정보 저장, 커뮤니티 활동을 제한 없이\n자유롭게 이용하실 수 있습니다.`}
        leftButtonText="둘러보기"
        rightButtonText="로그인/회원가입"
        onLeftButtonClick={handleReturnToPrevious}
        onRightButtonClick={() => navigate("/auth")}
      />
    </CenteredModal>
  ) : !authState.hasChatConsent ? (
    <CenteredModal>
      <OnboardCancelBox
        title="대화를 시작하기 전, 이용 동의가 필요해요!"
        description={
          <div className="flex w-full flex-col items-start gap-[20px]">
            <p>
              AI 챗봇 서비스 이용에 동의하시면, 지금 바로 AI와 자유롭게
              <br />
              대화를 나누고 필요한 정보를 실시간으로 확인하실 수 있습니다.
            </p>
            <div className="flex items-center gap-[8px]">
              <AiCheckbox
                checked={consentChecked}
                onChange={(event) => setConsentChecked(event.target.checked)}
                label="(선택) AI 챗봇 이용 동의 방침"
                className="gap-[4px] text-h2-onboard text-background-500"
              />
              <button
                type="button"
                className="cursor-pointer text-h3-onboard text-background-500 underline underline-offset-2"
              >
                전문보기
              </button>
            </div>
          </div>
        }
        leftButtonText="둘러보기"
        rightButtonText="시작하기"
        className={
          !consentChecked
            ? "[&>div:last-child>div:last-child>button]:pointer-events-none [&>div:last-child>div:last-child>button]:bg-background-250! [&>div:last-child>div:last-child>button]:text-background-500!"
            : undefined
        }
        onLeftButtonClick={handleReturnToPrevious}
        onRightButtonClick={() => {
          if (!consentChecked) return;
          setAuthState((current) => ({ ...current, hasChatConsent: true }));
        }}
      />
    </CenteredModal>
  ) : authState.isFirstVisit ? (
    <CenteredModal>
      <OnboardCancelBox
        title="AI 챗봇 이용 전 안내드립니다"
        description={
          <div className="flex w-full flex-col items-start gap-[16px]">
            <p>
              보듬 AI의 답변은 참고용이며 정확하지 않을 수 있습니다.
              <br />
              중요한 복지 혜택이나 바우처 신청 전,
              <br />
              정확한 요건은 반드시 공식 기관을 통해 다시 한번 확인해 주세요.
            </p>
            <AiCheckbox
              checked={noticeChecked}
              onChange={(event) => setNoticeChecked(event.target.checked)}
              label="네, 확인했습니다"
              className="gap-[4px] text-h2-onboard text-background-500"
            />
          </div>
        }
        leftButtonText="둘러보기"
        rightButtonText="시작하기"
        className={
          !noticeChecked
            ? "[&>div:last-child>div:last-child>button]:pointer-events-none [&>div:last-child>div:last-child>button]:bg-background-250! [&>div:last-child>div:last-child>button]:text-background-500!"
            : undefined
        }
        onLeftButtonClick={handleReturnToPrevious}
        onRightButtonClick={() => {
          if (!noticeChecked) return;
          setAuthState((current) => ({ ...current, isFirstVisit: false }));
        }}
      />
    </CenteredModal>
  ) : null;

  const toggleFeedbackReason = (reason: string) => {
    setSelectedFeedbackReasons((current) =>
      current.includes(reason)
        ? current.filter((item) => item !== reason)
        : [...current, reason],
    );
  };

  const submitFeedback = () => {
    if (selectedFeedbackReasons.length === 0) return;

    setFeedbackOpen(false);
    showToast(
      "green",
      "소중한 의견 감사합니다! 더 정확한 정보로 보답하겠습니다",
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-60px)] justify-center bg-background-100 px-[27.5px] pb-[40px] pt-[20px]">
      <div className="flex w-full flex-col items-center gap-[18px]">
        <div className="w-full rounded-[8px] bg-main-200 px-[12px] py-[8px] text-body-sub text-main-500">
          AI 답변의 특성상 최신 변경된 제도와 일부 다를 수 있습니다. 정확한
          자격 요건과 지원 금액은 반드시 해당 공공기관이나 지자체에 최종
          확인하시기 바랍니다.
        </div>

        <AiChatPanel
          inputValue={inputValue}
          inputVariant={inputVariant}
          inputDisabled={isLoading}
          showHistoryButton={showHistoryButton}
          messagesRef={messagesRef}
          onInputChange={setInputValue}
          onSend={() => handleSend()}
          onHistoryClick={handleHistoryClick}
          onMessagesScroll={updateHistoryButtonVisibility}
        >
          {retainedHistorySections.map((section, index) => (
            <div
              key={section.dateTime}
              ref={
                index === retainedHistorySections.length - 1
                  ? historySectionRef
                  : undefined
              }
              className="w-full"
            >
              <DateDivider date={section.date} dateTime={section.dateTime} />
              {section.messages.map(renderMessage)}
            </div>
          ))}
          <div ref={todaySectionRef} className="w-full">
            <DateDivider
              date="2026년 7월 16일 목요일"
              dateTime="2026-07-16"
            />
            {messages.map(renderMessage)}
          </div>
        </AiChatPanel>
      </div>

      <AiChatStateSwitcher
        activeScenario={activeScenario}
        onChange={handleScenarioChange}
      />

      {entryModal}

      {feedbackOpen && (
        <CenteredModal>
          <OnboardCancelBox
            title="어떤 정보가 잘못되었나요?"
            description={
              <div className="flex w-full flex-col items-start gap-[16px]">
                {FEEDBACK_REASONS.map((reason) => (
                  <AiCheckbox
                    key={reason}
                    checked={selectedFeedbackReasons.includes(reason)}
                    onChange={() => toggleFeedbackReason(reason)}
                    label={reason}
                    className="gap-[4px] text-h2-onboard text-background-500"
                  />
                ))}
              </div>
            }
            leftButtonText="취소"
            rightButtonText="의견 전달하기"
            className={
              selectedFeedbackReasons.length === 0
                ? "[&>div:last-child>div:last-child>button]:pointer-events-none [&>div:last-child>div:last-child>button]:bg-background-250! [&>div:last-child>div:last-child>button]:text-background-500!"
                : undefined
            }
            onLeftButtonClick={() => setFeedbackOpen(false)}
            onRightButtonClick={submitFeedback}
          />
        </CenteredModal>
      )}
    </div>
  );
}
