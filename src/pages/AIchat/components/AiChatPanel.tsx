import { useState, type ReactNode, type RefObject, type UIEventHandler } from "react";

import AIMsgIcon from "@/assets/icons/AIMsg.svg?react";
import ChevronLeftIcon from "@/assets/icons/ChevronLeft.svg?react";

import AiInput, { type AiInputVariant } from "./AiInput";

function SendIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="size-[16px]"
    >
      <path
        d="M14.315 1.685 1.82 6.797c-.48.196-.45.886.045 1.04l5.02 1.56 1.56 5.02c.154.495.844.525 1.04.045L14.598 1.97c.085-.209-.074-.368-.283-.283Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m6.885 9.397 3.23-3.23"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

type AiChatPanelProps = {
  children: ReactNode;
  inputValue: string;
  inputVariant?: AiInputVariant;
  inputDisabled?: boolean;
  showHistoryButton?: boolean;
  messagesRef?: RefObject<HTMLDivElement | null>;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onHistoryClick?: () => void;
  onMessagesScroll?: UIEventHandler<HTMLDivElement>;
};

export default function AiChatPanel({
  children,
  inputValue,
  inputVariant = "default",
  inputDisabled = false,
  showHistoryButton = true,
  messagesRef,
  onInputChange,
  onSend,
  onHistoryClick,
  onMessagesScroll,
}: AiChatPanelProps) {
  const canSend = inputValue.trim().length > 0 && !inputDisabled;
  const [isInputExpanded, setIsInputExpanded] = useState(false);

  return (
    <section
      className={`flex w-full flex-col items-start overflow-hidden rounded-[10px] bg-background-100 shadow-[1px_1px_10px_rgba(0,0,0,0.1)] ring-1 ring-inset ring-background-250 ${
        isInputExpanded ? "h-[721px]" : "h-[701px]"
      }`}
    >
      <header className="flex h-[70px] w-full shrink-0 items-center justify-center gap-[12px] bg-background-100 px-[20px] py-[16px]">
        <AIMsgIcon aria-hidden="true" className="size-[32px] shrink-0" />

        <div className="flex min-w-0 flex-1 items-center justify-between">
          <div className="flex min-w-0 flex-1 flex-col items-start leading-[1.5]">
            <h1 className="w-full text-h2-list text-background-600">
              보듬 AI 요약 큐레이션
            </h1>
            <p className="w-full text-body-sub text-background-500">
              복지·기관·바우처 정보를 쉽게 안내해드립니다 · 실시간 응답
            </p>
          </div>

          {showHistoryButton && (
            <button
              type="button"
              onClick={onHistoryClick}
              className="ml-[12px] inline-flex shrink-0 cursor-pointer items-center justify-center gap-[4px] rounded-[10px] border border-background-300 bg-background-100 px-[16px] py-[8px] text-h4-list text-background-500 transition-colors hover:bg-background-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400"
            >
              <ChevronLeftIcon aria-hidden="true" className="size-[14px]" />
              이전 대화 보기
            </button>
          )}
        </div>
      </header>

      <div
        ref={messagesRef}
        onScroll={onMessagesScroll}
        className="h-[544px] w-full shrink-0 overflow-x-hidden overflow-y-auto bg-background-200 px-[26px] [scrollbar-color:#C1C6D1_transparent] [scrollbar-width:thin]"
      >
        <div className="flex w-full flex-col items-start">{children}</div>
      </div>

      <footer
        className={`flex w-full shrink-0 flex-col items-center gap-[10px] border-t border-main-100 px-[16px] py-[8.5px] ${
          isInputExpanded ? "h-[107px]" : "h-[87px]"
        }`}
      >
        <div className="flex w-full items-start justify-end gap-[10px]">
          <AiInput
            value={inputValue}
            variant={inputVariant}
            disabled={inputDisabled}
            onValueChange={onInputChange}
            onExpandedChange={setIsInputExpanded}
            onSubmit={onSend}
            className="min-w-0 flex-1"
          />

          <button
            type="button"
            aria-label="메시지 전송"
            disabled={!canSend}
            onClick={onSend}
            className={`flex size-[44px] shrink-0 items-center justify-center rounded-[10px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-400 ${
              canSend
                ? "cursor-pointer bg-main-400 text-background-100 hover:bg-main-500"
                : "cursor-not-allowed bg-background-250 text-background-400"
            }`}
          >
            <SendIcon />
          </button>
        </div>

        <p className="w-full text-center text-body-sub-2 text-background-400">
          AI 답변은 참고용이며, 공식 기관에서 최종 확인을 권장합니다
        </p>
      </footer>
    </section>
  );
}
