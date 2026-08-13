import OnboardCancelBox from "@/components/OnboardCancelBox";
import LoginRequiredModal from "@/components/modal/LoginRequiredModal";
import Modal from "@/components/modal/Modal";
import { legalLinks } from "@/constants/legalLinks";
import type { AiFeedbackReason } from "@/types/aiChat";
import AiCheckbox from "./AiCheckbox";

const FEEDBACK_REASONS: Array<{
  label: string;
  value: AiFeedbackReason;
}> = [
  { label: "신청 기간이나 운영 시간", value: "TIME" },
  { label: "지원 대상(자격 요건)", value: "ELIGIBILITY" },
  { label: "금액이나 혜택 내용", value: "BENEFIT" },
  { label: "전화번호나 위치 정보", value: "INSTITUTION_INFO" },
  { label: "기타", value: "ETC" },
];

type EntryModalType =
  | "login-required"
  | "consent-required"
  | "guide"
  | null;

interface AiChatEntryModalProps {
  type: EntryModalType;
  consentChecked: boolean;
  noticeChecked: boolean;
  isConsentSubmitting: boolean;
  isGuideSubmitting: boolean;
  onClose: () => void;
  onConsentChange: (checked: boolean) => void;
  onNoticeChange: (checked: boolean) => void;
  onConsentSubmit: () => void;
  onGuideSubmit: () => void;
}

export function AiChatEntryModal({
  type,
  consentChecked,
  noticeChecked,
  isConsentSubmitting,
  isGuideSubmitting,
  onClose,
  onConsentChange,
  onNoticeChange,
  onConsentSubmit,
  onGuideSubmit,
}: AiChatEntryModalProps) {
  if (type === "login-required") {
    return <LoginRequiredModal open onClose={onClose} />;
  }

  if (type === "consent-required") {
    return (
      <Modal open onClose={onClose}>
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
                  onChange={(event) => onConsentChange(event.target.checked)}
                  label="(선택) AI 챗봇 이용 동의 방침"
                  className="gap-[4px] text-h2-onboard text-background-500"
                />
                <a
                  href={legalLinks.aiChatTerms}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer text-h3-onboard text-background-500 underline underline-offset-2"
                >
                  전문보기
                </a>
              </div>
            </div>
          }
          leftButtonText="둘러보기"
          rightButtonText={isConsentSubmitting ? "저장 중..." : "시작하기"}
          rightButtonDisabled={!consentChecked || isConsentSubmitting}
          onLeftButtonClick={onClose}
          onRightButtonClick={onConsentSubmit}
        />
      </Modal>
    );
  }

  if (type !== "guide") return null;

  return (
    <Modal open onClose={onClose}>
      <OnboardCancelBox
        title="AI 챗봇 이용 전 안내드립니다"
        description={
          <div className="flex w-full flex-col items-start gap-[16px]">
            <p>
              보듬 AI의 답변은 참고용이며 정확하지 않을 수 있습니다.
              <br />
              중요한 복지 혜택이나 바우처 신청 전,<br />
              정확한 요건은 반드시 공식 기관을 통해 다시 한번 확인해 주세요.
            </p>
            <AiCheckbox
              checked={noticeChecked}
              onChange={(event) => onNoticeChange(event.target.checked)}
              label="네, 확인했습니다"
              className="gap-[4px] text-h2-onboard text-background-500"
            />
          </div>
        }
        leftButtonText="둘러보기"
        rightButtonText={isGuideSubmitting ? "저장 중..." : "시작하기"}
        rightButtonDisabled={!noticeChecked || isGuideSubmitting}
        onLeftButtonClick={onClose}
        onRightButtonClick={onGuideSubmit}
      />
    </Modal>
  );
}

interface AiFeedbackModalProps {
  open: boolean;
  selectedReasons: AiFeedbackReason[];
  isSubmitting: boolean;
  onClose: () => void;
  onToggleReason: (reason: AiFeedbackReason) => void;
  onSubmit: () => void;
}

export function AiFeedbackModal({
  open,
  selectedReasons,
  isSubmitting,
  onClose,
  onToggleReason,
  onSubmit,
}: AiFeedbackModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <OnboardCancelBox
        title="어떤 정보가 잘못되었나요?"
        description={
          <div className="flex w-full flex-col items-start gap-[16px]">
            {FEEDBACK_REASONS.map((reason) => (
              <AiCheckbox
                key={reason.value}
                checked={selectedReasons.includes(reason.value)}
                onChange={() => onToggleReason(reason.value)}
                label={reason.label}
                className="gap-[4px] text-h2-onboard text-background-500"
              />
            ))}
          </div>
        }
        leftButtonText="취소"
        rightButtonText={isSubmitting ? "전달 중..." : "의견 전달하기"}
        rightButtonDisabled={selectedReasons.length === 0 || isSubmitting}
        onLeftButtonClick={onClose}
        onRightButtonClick={onSubmit}
      />
    </Modal>
  );
}
