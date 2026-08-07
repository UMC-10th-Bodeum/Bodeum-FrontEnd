import type { ProfileSettingsForm, UserDashboard } from "@/types/mypage";
import type { DisabilityType, UserProfile } from "@/types/user";
import type { DiagnosisType } from "@/types/diagnosis";

type ProfileSettingsSource = Pick<
  UserProfile | UserDashboard,
  | "profileImageUrl"
  | "nickname"
  | "regionLevel1"
  | "regionLevel2"
  | "childProfile"
>;

const diagnosisByApiCode: Record<string, DiagnosisType> = {
  AUTISM: "AUTISM",
  INTELLECTUAL_DISABILITY: "INTELLECTUAL_DISABILITY",
  CEREBRAL_PALSY: "BRAIN_LESION",
  BRAIN_LESION: "BRAIN_LESION",
  ADHD: "ADHD",
  DEVELOPMENTAL_DELAY: "DEVELOPMENTAL_DELAY",
  LANGUAGE_DISORDER: "LANGUAGE_DISORDER",
  ETC: "ETC",
};

const apiCodeByDiagnosis: Record<DiagnosisType, DisabilityType> = {
  AUTISM: "AUTISM",
  INTELLECTUAL_DISABILITY: "INTELLECTUAL_DISABILITY",
  BRAIN_LESION: "CEREBRAL_PALSY",
  ADHD: "ADHD",
  DEVELOPMENTAL_DELAY: "DEVELOPMENTAL_DELAY",
  LANGUAGE_DISORDER: "LANGUAGE_DISORDER",
  ETC: "ETC",
};

export function cloneProfileSettings(
  profile: ProfileSettingsForm,
): ProfileSettingsForm {
  return {
    ...profile,
    diagnoses: [...profile.diagnoses],
  };
}

export function toApiDisabilityTypes(diagnoses: DiagnosisType[]) {
  return diagnoses.map((diagnosis) => apiCodeByDiagnosis[diagnosis]);
}

export function toProfileSettings(profile: ProfileSettingsSource): ProfileSettingsForm {
  const [birthYear = "", birthMonth = ""] =
    profile.childProfile?.birth?.split("-") ?? [];
  const diagnoses = (profile.childProfile?.disabilityTypes ?? [])
    .map(({ code }) => diagnosisByApiCode[code])
    .filter((diagnosis): diagnosis is DiagnosisType => Boolean(diagnosis));

  return {
    profileImageUrl: profile.profileImageUrl,
    profileImageFile: null,
    parentNickname: profile.nickname,
    region: profile.regionLevel1 ?? "",
    district:
      profile.regionLevel2 && profile.regionLevel2 !== profile.regionLevel1
        ? profile.regionLevel2
        : "",
    childNickname: profile.childProfile?.nickname ?? "",
    birthYear,
    birthMonth: birthMonth.replace(/^0/, ""),
    diagnoses,
  };
}
