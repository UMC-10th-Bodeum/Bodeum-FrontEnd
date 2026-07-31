import { useRef } from "react";
import ButtonOutline from "@/components/ButtonOutline";
import ButtonFill from "@/components/ButtonFill";
import ChoiceChips from "@/components/ChoiceChips";
import Input from "@/components/Input";
import { diagnosisMap } from "@/constants/diagnosis";
import {
  districtOptionsByRegion,
  regionOptions,
  sidoDisplayNameByRegion,
} from "@/constants/regions";
import type { DiagnosisType } from "@/types/diagnosis";
import { birthMonthOptions, birthYearOptions } from "./data";
import type { ProfileSettingsForm } from "./types";
import ProfileImagePicker from "./components/ProfileImagePicker";
import ProfileSelect from "./components/ProfileSelect";

interface ProfileManagementCardProps {
  form: ProfileSettingsForm;
  isEditing: boolean;
  onChange: (form: ProfileSettingsForm) => void;
  onStartEdit: () => void;
  onCancel: () => void;
  onApply: () => void;
}

const diagnosisEntries = Object.entries(diagnosisMap) as Array<
  [DiagnosisType, (typeof diagnosisMap)[DiagnosisType]]
>;

type ProfileSelectField = "region" | "district" | "birthYear" | "birthMonth";
type ProfileSelectValues = Pick<ProfileSettingsForm, ProfileSelectField>;

const getProfileSelectValues = (form: ProfileSettingsForm): ProfileSelectValues => ({
  region: form.region,
  district: form.district,
  birthYear: form.birthYear,
  birthMonth: form.birthMonth,
});

function isValidBirthDate(birthYear: string, birthMonth: string) {
  if (!birthYear || !birthMonth) {
    return false;
  }

  const year = Number(birthYear);
  const month = Number(birthMonth);

  if (!Number.isInteger(year) || year <= 0 || !Number.isInteger(month) || month < 1 || month > 12) {
    return false;
  }

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  return year < currentYear || (year === currentYear && month <= currentMonth);
}

export default function ProfileManagementCard({
  form,
  isEditing,
  onChange,
  onStartEdit,
  onCancel,
  onApply,
}: ProfileManagementCardProps) {
  const initialSelectValuesRef = useRef<ProfileSelectValues | null>(null);

  const canApply =
    form.parentNickname.trim().length > 0 &&
    form.childNickname.trim().length > 0 &&
    isValidBirthDate(form.birthYear, form.birthMonth) &&
    form.diagnoses.length > 0;
  const updateField = <Key extends keyof ProfileSettingsForm>(
    key: Key,
    value: ProfileSettingsForm[Key],
  ) => {
    onChange({ ...form, [key]: value });
  };

  const toggleDiagnosis = (diagnosis: DiagnosisType) => {
    const diagnoses = form.diagnoses.includes(diagnosis)
      ? form.diagnoses.filter((item) => item !== diagnosis)
      : [...form.diagnoses, diagnosis];

    updateField("diagnoses", diagnoses);
  };

  const startEditing = () => {
    initialSelectValuesRef.current = getProfileSelectValues(form);
    onStartEdit();
  };

  const hasSelectChanged = (field: ProfileSelectField) => {
    const initialValues = initialSelectValuesRef.current;
    return isEditing && initialValues !== null && initialValues[field] !== form[field];
  };

  return (
    <section className="w-[634px] rounded-[20px] bg-background-100 p-[20px]">
      <h1 className="border-b border-background-300 py-[8px] text-h2-list text-background-600">
        프로필 관리
      </h1>

      <div className="mt-[24px] flex items-center">
        <ProfileImagePicker
          imageUrl={form.profileImageUrl}
          imageFile={form.profileImageFile}
          isEditing={isEditing}
          onChange={(profileImageFile) =>
            updateField("profileImageFile", profileImageFile)
          }
        />
        <div className="ml-[20px]">
          <h2 className="text-h2-list text-background-600">{form.parentNickname}</h2>
          <p className="mt-[4px] text-h4-list text-background-500">
            가입일 2026.01.15 · 효율형 부모
          </p>
        </div>
        {isEditing ? (
          <div className="ml-auto flex gap-[8px]">
            <ButtonOutline
              label="취소하기"
              onClick={onCancel}
              className="h-[44px] w-[91px] !text-h2-onboard"
            />
            <ButtonFill
              label="적용하기"
              disabled={!canApply}
              onClick={onApply}
              className="h-[44px] w-[91px] !text-h2-onboard"
            />
          </div>
        ) : (
          <ButtonOutline
            label="프로필 편집"
            onClick={startEditing}
            className="ml-auto h-[44px] w-[110px] !text-h2-onboard"
          />
        )}
      </div>

      <div className="mt-[24px]">
        <label
          htmlFor="parent-nickname"
          className="mb-[12px] block text-h3-onboard text-background-500"
        >
          닉네임
        </label>
        <Input
          id="parent-nickname"
          value={form.parentNickname}
          disabled={!isEditing}
          onChange={(event) => updateField("parentNickname", event.target.value)}
          className="h-[48px] !border !border-background-300"
        />
      </div>

      <div className="mt-[24px]">
        <span className="mb-[12px] block text-h3-onboard text-background-500">지역</span>
        <div className="grid grid-cols-2 gap-[12px]">
          <ProfileSelect
            variant="L"
            ariaLabel="시/도 선택"
            options={regionOptions.map((option) => ({
              ...option,
              label: sidoDisplayNameByRegion[option.value] ?? option.label,
            }))}
            value={form.region}
            disabled={!isEditing}
            changed={hasSelectChanged("region")}
            onChange={(region) => {
              onChange({
                ...form,
                region,
                district: districtOptionsByRegion[region]?.[0]?.value ?? "",
              });
            }}
            className="w-full"
          />
          <ProfileSelect
            variant="L"
            ariaLabel="시/군/구 선택"
            options={districtOptionsByRegion[form.region] ?? []}
            value={form.district}
            disabled={!isEditing}
            changed={hasSelectChanged("district")}
            onChange={(district) => updateField("district", district)}
            className="w-full"
          />
        </div>
      </div>

      <h2 className="mt-[24px] border-b border-background-300 py-[8px] text-h2-list text-background-600">
        자녀 프로필
      </h2>

      <div className="mt-[24px]">
        <label
          htmlFor="child-nickname"
          className="mb-[12px] block text-h3-onboard text-background-500"
        >
          자녀 별명
        </label>
        <Input
          id="child-nickname"
          value={form.childNickname}
          disabled={!isEditing}
          onChange={(event) => updateField("childNickname", event.target.value)}
          className="h-[48px] !border !border-background-300"
        />
      </div>

      <div className="mt-[26px]">
        <span className="mb-[12px] block text-h3-onboard text-background-500">자녀 생년월일*</span>
        <div className="grid grid-cols-2 gap-[14px]">
          <ProfileSelect
            variant="L"
            ariaLabel="출생 연도"
            options={birthYearOptions}
            value={form.birthYear}
            disabled={!isEditing}
            changed={hasSelectChanged("birthYear")}
            onChange={(birthYear) => updateField("birthYear", birthYear)}
            placeholder="년도"
            className="w-full"
          />
          <ProfileSelect
            variant="L"
            ariaLabel="출생 월"
            options={birthMonthOptions}
            value={form.birthMonth}
            disabled={!isEditing}
            changed={hasSelectChanged("birthMonth")}
            onChange={(birthMonth) => updateField("birthMonth", birthMonth)}
            placeholder="월"
            className="w-full"
          />
        </div>
      </div>

      <fieldset className="mt-[24px]">
        <legend className="mb-[12px] text-h3-onboard text-background-500">
          집중 케어 영역* (복수 선택 가능)
        </legend>
        <div className="flex flex-wrap gap-[8px]">
          {diagnosisEntries.map(([diagnosis, { label }]) => (
            <ChoiceChips
              key={diagnosis}
              label={label}
              selected={form.diagnoses.includes(diagnosis)}
              disabled={!isEditing}
              onClick={() => toggleDiagnosis(diagnosis)}
              className="h-[40px] px-[18px] py-2"
            />
          ))}
        </div>
      </fieldset>
    </section>
  );
}
