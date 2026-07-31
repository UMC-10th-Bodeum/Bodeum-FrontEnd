import type { DiagnosisType } from "@/types/diagnosis";

export interface ProfileSettingsForm {
  profileImageUrl: string | null;
  profileImageFile: File | null;
  parentNickname: string;
  region: string;
  district: string;
  childNickname: string;
  birthYear: string;
  birthMonth: string;
  diagnoses: DiagnosisType[];
}
