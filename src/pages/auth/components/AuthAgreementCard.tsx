import { useId, useState } from "react";

import CheckboxBlankIcon from "@/assets/icons/CheckboxBlank.svg?react";
import CheckboxOutlineIcon from "@/assets/icons/CheckboxOutline.svg?react";
import OnboardBoxFrame from "@/components/OnboardBoxFrame";

type AuthAgreementCardProps = {
  onSubmit: () => void;
};

type AgreementKey = "terms" | "privacy" | "ai";

type AgreementRowProps = {
  checked: boolean;
  label: string;
  required?: boolean;
  onChange: () => void;
};

function AgreementCheckboxIcon({ checked }: { checked: boolean }) {
  const Icon = checked ? CheckboxOutlineIcon : CheckboxBlankIcon;

  return (
    <Icon
      aria-hidden="true"
      className="size-[24px] shrink-0 text-background-500"
    />
  );
}

function AgreementRow({
  checked,
  label,
  required = false,
  onChange,
}: AgreementRowProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <label className="flex cursor-pointer items-center gap-[9px] text-h2-onboard text-background-500">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <AgreementCheckboxIcon checked={checked} />
        <span>
          {required ? (
            <span className="text-main-400">(필수) </span>
          ) : (
            <span>(선택) </span>
          )}
          {label}
        </span>
      </label>
      <button
        type="button"
        className="cursor-pointer text-h3-onboard text-background-500 underline"
      >
        더보기
      </button>
    </div>
  );
}

export default function AuthAgreementCard({ onSubmit }: AuthAgreementCardProps) {
  const titleId = useId();
  const [agreements, setAgreements] = useState<Record<AgreementKey, boolean>>({
    terms: false,
    privacy: false,
    ai: false,
  });

  const requiredChecked = agreements.terms && agreements.privacy;
  const allChecked = agreements.terms && agreements.privacy && agreements.ai;

  const toggleAgreement = (key: AgreementKey) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAll = () => {
    const nextChecked = !allChecked;
    setAgreements({
      terms: nextChecked,
      privacy: nextChecked,
      ai: nextChecked,
    });
  };

  return (
    <div className="[&>div:first-child]:hidden">
      <OnboardBoxFrame
        buttonCount={1}
        rightButtonText="다음"
        showOverlay={false}
        rightButtonDisabled={!requiredChecked}
        className="w-[624px]! p-[44px]! shadow-[0_0_15px_rgb(102_128_155_/_0.1)] max-sm:px-[24px]! max-sm:py-[32px]!"
        ariaLabelledby={titleId}
        onRightButtonClick={onSubmit}
      >
        <div className="flex w-full flex-col gap-[44px]">
          <div className="flex w-full flex-col gap-[24px]">
            <h1 id={titleId} className="text-h1-onboard text-background-600">
              약관동의
            </h1>

            <div className="flex w-full flex-col gap-[20px]">
              <label className="flex w-full cursor-pointer items-center justify-center rounded-[10px] border border-main-100 bg-main-100 p-[20px]">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  className="sr-only"
                />
                <span className="flex min-w-0 flex-1 flex-col gap-[10px]">
                  <span className="flex items-center gap-[9px] text-h2-onboard text-background-600">
                    <AgreementCheckboxIcon checked={allChecked} />
                    <span>모두 동의합니다.</span>
                  </span>
                  <span className="text-h3-onboard text-background-500">
                    이용약관, 개인정보처리방침, AI 챗봇 이용 동의 방침에 대해
                    모두 동의합니다.
                    <br />
                    각 사항에 대한 동의 여부를 개별적으로 선택하실 수 있으며,
                    선택 동의 사항에 대한 동의를 거부하여도 서비스를 이용하실 수
                    있습니다.
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div className="flex w-full flex-col gap-[8px]">
            <AgreementRow
              checked={agreements.terms}
              required
              label="이용 약관 동의"
              onChange={() => toggleAgreement("terms")}
            />
            <AgreementRow
              checked={agreements.privacy}
              required
              label="개인정보처리방침"
              onChange={() => toggleAgreement("privacy")}
            />
            <AgreementRow
              checked={agreements.ai}
              label="AI 챗봇 이용 동의 방침"
              onChange={() => toggleAgreement("ai")}
            />
          </div>
        </div>
      </OnboardBoxFrame>
    </div>
  );
}
