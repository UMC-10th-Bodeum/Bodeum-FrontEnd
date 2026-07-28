import type { DiagnosisType } from "@/types/diagnosis";

export interface ProfileSettingsForm {
  parentNickname: string;
  region: string;
  district: string;
  childNickname: string;
  birthYear: string;
  birthMonth: string;
  diagnoses: DiagnosisType[];
}
