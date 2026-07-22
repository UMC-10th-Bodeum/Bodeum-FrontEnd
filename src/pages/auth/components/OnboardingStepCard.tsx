import { useId, type ReactNode } from "react";

import Input from "@/components/Input";
import OnboardBoxFrame from "@/components/OnboardBoxFrame";
import { Select, type SelectOption } from "@/components/Select";

import SelectableChip from "./SelectableChip";

export type OnboardingStep = 1 | 2 | 3;

export type OnboardingFormState = {
  childName: string;
  birthYear: string;
  birthMonth: string;
  careAreas: string[];
  childKeywords: string;
  interests: string[];
  sido: string;
  district: string;
  guardianNickname: string;
  guardianType: string;
  guardianRole: string;
};

type OnboardingStepCardProps = {
  step: OnboardingStep;
  form: OnboardingFormState;
  onChange: (form: OnboardingFormState) => void;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  onSkip: () => void;
  isSubmitting?: boolean;
};

type FormGroupProps = {
  label: ReactNode;
  children: ReactNode;
  htmlFor?: string;
  as?: "div" | "fieldset";
};

type LimitedTextInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxLength: number;
};

const currentYear = new Date().getFullYear();
const birthYearStart = 2008;
const nicknameMaxLength = 20;

const yearOptions: SelectOption[] = Array.from(
  { length: currentYear - birthYearStart + 1 },
  (_, index) => {
    const year = birthYearStart + index;
    return { label: `${year}년`, value: `${year}` };
  },
);

const createOptions = (values: string[]): SelectOption[] =>
  values.map((value) => ({ label: value, value }));

const limitTextLength = (value: string, maxLength: number) =>
  Array.from(value).slice(0, maxLength).join("");

const sidoNames = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "전남광주통합특별시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "강원특별자치도",
  "충청북도",
  "충청남도",
  "전북특별자치도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
];

const districtNamesByRegion: Record<string, string[]> = {
  서울특별시: [
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ],
  부산광역시: [
    "강서구",
    "금정구",
    "기장군",
    "남구",
    "동구",
    "동래구",
    "부산진구",
    "북구",
    "사상구",
    "사하구",
    "서구",
    "수영구",
    "연제구",
    "영도구",
    "중구",
    "해운대구",
  ],
  대구광역시: [
    "남구",
    "달서구",
    "달성군",
    "동구",
    "북구",
    "서구",
    "수성구",
    "중구",
    "군위군",
  ],
  인천광역시: [
    "제물포구",
    "영종구",
    "미추홀구",
    "연수구",
    "남동구",
    "부평구",
    "계양구",
    "서해구",
    "검단구",
    "강화군",
    "옹진군",
  ],
  전남광주통합특별시: [
    "목포시",
    "여수시",
    "순천시",
    "나주시",
    "광양시",
    "동구",
    "서구",
    "남구",
    "북구",
    "광산구",
    "담양군",
    "곡성군",
    "구례군",
    "고흥군",
    "보성군",
    "화순군",
    "장흥군",
    "강진군",
    "해남군",
    "영암군",
    "무안군",
    "함평군",
    "영광군",
    "장성군",
    "완도군",
    "진도군",
    "신안군",
  ],
  대전광역시: ["대덕구", "동구", "서구", "유성구", "중구"],
  울산광역시: ["남구", "동구", "북구", "울주군", "중구"],
  세종특별자치시: [],
  경기도: [
    "가평군",
    "고양시",
    "과천시",
    "광명시",
    "광주시",
    "구리시",
    "군포시",
    "김포시",
    "남양주시",
    "동두천시",
    "부천시",
    "성남시",
    "수원시",
    "시흥시",
    "안산시",
    "안성시",
    "안양시",
    "양주시",
    "양평군",
    "여주시",
    "연천군",
    "오산시",
    "용인시",
    "의왕시",
    "의정부시",
    "이천시",
    "파주시",
    "평택시",
    "포천시",
    "하남시",
    "화성시",
  ],
  강원특별자치도: [
    "강릉시",
    "고성군",
    "동해시",
    "삼척시",
    "속초시",
    "양구군",
    "양양군",
    "영월군",
    "원주시",
    "인제군",
    "정선군",
    "철원군",
    "춘천시",
    "태백시",
    "평창군",
    "홍천군",
    "화천군",
    "횡성군",
  ],
  충청북도: [
    "괴산군",
    "단양군",
    "보은군",
    "영동군",
    "옥천군",
    "음성군",
    "제천시",
    "증평군",
    "진천군",
    "청주시",
    "충주시",
  ],
  충청남도: [
    "계룡시",
    "공주시",
    "금산군",
    "논산시",
    "당진시",
    "보령시",
    "부여군",
    "서산시",
    "서천군",
    "아산시",
    "예산군",
    "천안시",
    "청양군",
    "태안군",
    "홍성군",
  ],
  전북특별자치도: [
    "고창군",
    "군산시",
    "김제시",
    "남원시",
    "무주군",
    "부안군",
    "순창군",
    "완주군",
    "익산시",
    "임실군",
    "장수군",
    "전주시",
    "정읍시",
    "진안군",
  ],
  경상북도: [
    "경산시",
    "경주시",
    "고령군",
    "구미시",
    "김천시",
    "문경시",
    "봉화군",
    "상주시",
    "성주군",
    "안동시",
    "영덕군",
    "영양군",
    "영주시",
    "영천시",
    "예천군",
    "울릉군",
    "울진군",
    "의성군",
    "청도군",
    "청송군",
    "칠곡군",
    "포항시",
  ],
  경상남도: [
    "거제시",
    "거창군",
    "고성군",
    "김해시",
    "남해군",
    "밀양시",
    "사천시",
    "산청군",
    "양산시",
    "의령군",
    "진주시",
    "창녕군",
    "창원시",
    "통영시",
    "하동군",
    "함안군",
    "함양군",
    "합천군",
  ],
  제주특별자치도: ["서귀포시", "제주시"],
};

const regionOptions = createOptions(sidoNames);

const districtOptionsByRegion: Record<string, SelectOption[]> = Object.fromEntries(
  sidoNames.map((sido) => [sido, createOptions(districtNamesByRegion[sido] ?? [])]),
);

const monthOptions: SelectOption[] = Array.from({ length: 12 }, (_, index) => {
  const month = index + 1;
  return { label: `${month}월`, value: `${month}` };
});

const careAreaOptions = [
  "자폐스펙트럼",
  "지적장애",
  "뇌병변장애",
  "ADHD",
  "발달지연",
  "언어장애",
  "기타",
];

const interestOptions = [
  "맞춤 복지·지원금",
  "안심 병원·건강",
  "육아 상담·소통",
  "성장·교육",
];

const guardianTypeOptions = ["부모", "조부모", "형제·자매", "기타"];

const guardianRoleOptions = [
  "[정보 탐색자] : 기초 정보와 가이드가 필요한 단계",
  "[경험 공유자] : 이웃과 가벼운 팁을 주고받고 싶은 단계",
  "[지혜 조력자] : 나만의 노하우를 적극적으로 나누고 싶은 단계",
];

const formLabelClassName = "text-h3-onboard text-background-500";

function FormGroup({
  label,
  children,
  htmlFor,
  as = "div",
}: FormGroupProps) {
  if (as === "fieldset") {
    return (
      <fieldset className="m-0 flex w-full min-w-0 flex-col items-start gap-[12px] border-0 p-0 py-[4px]">
        <legend className={formLabelClassName}>{label}</legend>
        {children}
      </fieldset>
    );
  }

  return (
    <div className="flex w-full flex-col items-start gap-[12px] py-[4px]">
      {htmlFor ? (
        <label htmlFor={htmlFor} className={formLabelClassName}>
          {label}
        </label>
      ) : (
        <div className={formLabelClassName}>{label}</div>
      )}
      {children}
    </div>
  );
}

function StepProgress({ activeStep }: { activeStep: OnboardingStep }) {
  return (
    <div className="flex h-[5px] w-full gap-[24px]">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className={[
            "h-[5px] w-[160px] rounded-[4px]",
            index < activeStep ? "bg-main-400" : "bg-background-300",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

function StepHeader({
  titleBefore,
  highlight,
  titleAfter,
  description,
  titleId,
}: {
  titleBefore: string;
  highlight: string;
  titleAfter: string;
  description: string;
  titleId: string;
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      <h1 id={titleId} className="text-h1-onboard text-background-600">
        {titleBefore}
        <span className="text-main-500">{highlight}</span>
        {titleAfter}
      </h1>
      <p className="w-full max-w-[536px] text-h2-onboard text-background-500">
        {description}
      </p>
    </div>
  );
}

function SkipButton({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex cursor-pointer items-center gap-[4px] text-h3-onboard text-background-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span>건너뛰기</span>
      <span aria-hidden="true">&gt;</span>
    </button>
  );
}

function LimitedTextInput({
  id,
  value,
  onChange,
  placeholder,
  maxLength,
}: LimitedTextInputProps) {
  const length = Array.from(value).length;

  return (
    <div className="relative w-full max-w-[536px]">
      <Input
        id={id}
        value={value}
        onChange={(event) =>
          onChange(limitTextLength(event.target.value, maxLength))
        }
        placeholder={placeholder}
        className="w-full pr-[74px]!"
      />
      <span className="pointer-events-none absolute right-[20px] top-1/2 -translate-y-1/2 text-h6-list text-background-400">
        {length}/{maxLength}
      </span>
    </div>
  );
}

export default function OnboardingStepCard({
  step,
  form,
  onChange,
  onPrev,
  onNext,
  onClose,
  onSkip,
  isSubmitting = false,
}: OnboardingStepCardProps) {
  const titleId = useId();
  const childNameId = useId();
  const birthYearId = useId();
  const birthMonthId = useId();
  const childKeywordsId = useId();
  const activityRegionId = useId();
  const activityDistrictId = useId();
  const guardianNicknameId = useId();

  const updateField = <K extends keyof OnboardingFormState>(
    key: K,
    value: OnboardingFormState[K],
  ) => {
    onChange({ ...form, [key]: value });
  };

  const toggleListValue = (
    key: "careAreas" | "interests",
    value: string,
    limit?: number,
  ) => {
    const currentValues = form[key];
    const isSelected = currentValues.includes(value);

    if (!isSelected && limit && currentValues.length >= limit) {
      return;
    }

    updateField(
      key,
      isSelected
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value],
    );
  };

  const districtOptions = form.sido
    ? (districtOptionsByRegion[form.sido] ?? [])
    : [];
  const districtRequired = districtOptions.length > 0;

  const isComplete =
    step === 1
      ? Boolean(form.birthYear && form.birthMonth && form.careAreas.length)
      : step === 2
        ? Boolean(
            form.interests.length &&
              form.sido &&
              (!districtRequired || form.district),
          )
        : Boolean(form.guardianNickname.trim());

  const content = (
    <div className="flex h-[560px] w-full min-w-0 flex-col items-start gap-[20px]">
      <StepProgress activeStep={step} />

      {step === 1 && (
        <>
          <StepHeader
            titleId={titleId}
            titleBefore="반갑습니다, 맞춤 정보를 위해 "
            highlight="아이"
            titleAfter="를 소개해 주세요!"
            description="아이의 연령과 상황에 꼭 맞는 복지·기관 정보를 정교하게 찾아드립니다"
          />
          <FormGroup label="자녀 이름 또는 별명 (선택)" htmlFor={childNameId}>
            <LimitedTextInput
              id={childNameId}
              value={form.childName}
              onChange={(value) => updateField("childName", value)}
              placeholder="예: 우리 아이, 민준이"
              maxLength={nicknameMaxLength}
            />
          </FormGroup>
          <FormGroup label="자녀 생년월*" as="fieldset">
            <div className="flex w-full flex-wrap gap-[12px]">
              <Select
                id={birthYearId}
                variant="L"
                value={form.birthYear}
                options={yearOptions}
                onChange={(value) => updateField("birthYear", value)}
                placeholder="년도"
                ariaLabel="자녀 생년월 년도"
                className="min-w-[160px] flex-1"
              />
              <Select
                id={birthMonthId}
                variant="L"
                value={form.birthMonth}
                options={monthOptions}
                onChange={(value) => updateField("birthMonth", value)}
                placeholder="월"
                ariaLabel="자녀 생년월 월"
                className="min-w-[160px] flex-1"
              />
            </div>
          </FormGroup>
          <FormGroup label="집중 케어 영역* (복수 선택 가능)" as="fieldset">
            <div className="flex w-full flex-wrap gap-x-[13px] gap-y-[8px]">
              {careAreaOptions.map((option) => (
                <SelectableChip
                  key={option}
                  label={option}
                  selected={form.careAreas.includes(option)}
                  onClick={() => toggleListValue("careAreas", option)}
                />
              ))}
            </div>
          </FormGroup>
          <FormGroup label="자녀 특징 키워드(선택)" htmlFor={childKeywordsId}>
            <LimitedTextInput
              id={childKeywordsId}
              value={form.childKeywords}
              onChange={(value) => updateField("childKeywords", value)}
              placeholder="아이와 닮은 친구를 찾기 위한 키워드를 입력해주세요(소심함, 활발함, 소리 예민 등)"
              maxLength={100}
            />
          </FormGroup>
        </>
      )}

      {step === 2 && (
        <>
          <StepHeader
            titleId={titleId}
            titleBefore="지금 보호자님에게 가장 필요한 "
            highlight="도움"
            titleAfter="은 무엇인가요?"
            description="선택하신 관심사와 활동 지역을 바탕으로 맞춤 정보가 세팅됩니다"
          />
          <FormGroup label="가장 큰 관심사 (최대 2개 선택)*" as="fieldset">
            <div className="flex w-full flex-wrap gap-[13px]">
              {interestOptions.map((option) => (
                <SelectableChip
                  key={option}
                  label={option}
                  selected={form.interests.includes(option)}
                  onClick={() => toggleListValue("interests", option, 2)}
                />
              ))}
            </div>
          </FormGroup>
          <FormGroup label="주 활동 지역*" as="fieldset">
            <div className="flex w-full flex-wrap gap-[12px]">
              <Select
                id={activityRegionId}
                variant="L"
                value={form.sido}
                options={regionOptions}
                onChange={(value) =>
                  onChange({ ...form, sido: value, district: "" })
                }
                placeholder="시/도"
                ariaLabel="주 활동 지역 시/도"
                className="min-w-[160px] flex-1"
              />
              <Select
                id={activityDistrictId}
                variant="L"
                value={form.district}
                options={districtOptions}
                onChange={(value) => updateField("district", value)}
                placeholder="시/군/구"
                disabled={!form.sido || !districtRequired}
                ariaLabel="주 활동 지역 시/군/구"
                className="min-w-[160px] flex-1"
              />
            </div>
          </FormGroup>
        </>
      )}

      {step === 3 && (
        <>
          <StepHeader
            titleId={titleId}
            titleBefore="보듬과 함께할 "
            highlight="보호자"
            titleAfter="님을 알려주세요"
            description="설정하신 커뮤니티 역할은 보호자님들의 신뢰 자산이 됩니다"
          />
          <FormGroup label="보호자 닉네임*" htmlFor={guardianNicknameId}>
            <LimitedTextInput
              id={guardianNicknameId}
              value={form.guardianNickname}
              onChange={(value) => updateField("guardianNickname", value)}
              placeholder="예: 민준맘"
              maxLength={nicknameMaxLength}
            />
          </FormGroup>
          <FormGroup label="보호자 유형(선택)" as="fieldset">
            <div className="flex w-full flex-wrap gap-[13px]">
              {guardianTypeOptions.map((option) => (
                <SelectableChip
                  key={option}
                  label={option}
                  selected={form.guardianType === option}
                  onClick={() =>
                    updateField(
                      "guardianType",
                      form.guardianType === option ? "" : option,
                    )
                  }
                />
              ))}
            </div>
          </FormGroup>
          <FormGroup label="커뮤니티 역할 성향(선택)" as="fieldset">
            <div className="flex w-full flex-col items-start gap-[12px]">
              {guardianRoleOptions.map((option) => (
                <SelectableChip
                  key={option}
                  label={option}
                  selected={form.guardianRole === option}
                  onClick={() =>
                    updateField(
                      "guardianRole",
                      form.guardianRole === option ? "" : option,
                    )
                  }
                  buttonClassName="w-full max-w-[424px]"
                  className="w-full! justify-start!"
                />
              ))}
            </div>
          </FormGroup>
        </>
      )}
    </div>
  );

  const frameChildren = (
    <div className="flex w-full min-w-0 flex-col gap-[44px]">
      {content}
      <div className="flex w-full justify-center">
        <SkipButton onClick={onSkip} disabled={isSubmitting} />
      </div>
    </div>
  );

  if (step === 1) {
    return (
      <OnboardBoxFrame
        buttonCount={1}
        rightButtonText={isSubmitting ? "저장 중..." : "다음"}
        showClose
        showOverlay={false}
        rightButtonDisabled={!isComplete || isSubmitting}
        className="w-[624px]! gap-[16px]! p-[44px]! max-sm:px-[24px]! max-sm:py-[32px]!"
        ariaLabelledby={titleId}
        onClose={isSubmitting ? undefined : onClose}
        onRightButtonClick={onNext}
      >
        {frameChildren}
      </OnboardBoxFrame>
    );
  }

  return (
    <OnboardBoxFrame
      buttonCount={2}
      leftButtonText="이전"
      rightButtonText={
        isSubmitting ? "저장 중..." : step === 3 ? "완료" : "다음"
      }
      showClose
      showOverlay={false}
      leftButtonDisabled={isSubmitting}
      rightButtonDisabled={!isComplete || isSubmitting}
      className="w-[624px]! gap-[16px]! p-[44px]! max-sm:px-[24px]! max-sm:py-[32px]!"
      ariaLabelledby={titleId}
      onClose={isSubmitting ? undefined : onClose}
      onLeftButtonClick={onPrev}
      onRightButtonClick={onNext}
    >
      {frameChildren}
    </OnboardBoxFrame>
  );
}
