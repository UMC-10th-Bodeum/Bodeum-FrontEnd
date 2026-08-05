import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getApiErrorDetailMessage } from "@/apis/apiError";
import { findRegionId } from "@/apis/onboardingApi";
import { notifyUserProfileChanged } from "@/apis/userApi";
import {
  myPageRegionsQueryOptions,
  myProfileQueryOptions,
  USER_DASHBOARD_QUERY_KEY,
  USER_PROFILE_QUERY_KEY,
  useUpdateMyProfile,
  useUpdateProfileImage,
} from "@/hooks/useMyPage";
import type { ProfileSettingsForm, UpdateMyProfileRequest } from "@/types/mypage";
import DetailBackButton from "@/components/DetailBackButton";
import { showToast } from "@/components/Toast";
import AccountManagementCard from "./settings/AccountManagementCard";
import ProfileManagementCard from "./settings/ProfileManagementCard";
import WithdrawalModal from "./settings/components/WithdrawalModal";
import { useMyPageProfile } from "./settings/myPageProfileContext";
import {
  cloneProfileSettings,
  toApiDisabilityTypes,
  toProfileSettings,
} from "./settings/profileSettingsMapper";

function getChildBirth(profile: ProfileSettingsForm) {
  if (!profile.birthYear || !profile.birthMonth) {
    return "";
  }

  return `${profile.birthYear}-${profile.birthMonth.padStart(2, "0")}`;
}

function haveSameValues(left: string[], right: string[]) {
  return (
    left.length === right.length &&
    [...left].sort().every((value, index) => value === [...right].sort()[index])
  );
}

export default function ProfileSettingsPage() {
  const queryClient = useQueryClient();
  const { mutateAsync: updateProfile } = useUpdateMyProfile();
  const { mutateAsync: uploadProfileImage } = useUpdateProfileImage();
  const { profile, joinedAt, guardianType, badgeName, saveProfile } = useMyPageProfile();
  const [draftProfile, setDraftProfile] = useState(() => cloneProfileSettings(profile));
  const [isEditing, setIsEditing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  const startEditing = () => {
    setDraftProfile(cloneProfileSettings(profile));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraftProfile(cloneProfileSettings(profile));
    setIsEditing(false);
  };

  const applyEditing = async () => {
    if (isApplying) {
      return;
    }

    setIsApplying(true);

    try {
      const request: UpdateMyProfileRequest = {};
      const nickname = draftProfile.parentNickname.trim();
      const childNickname = draftProfile.childNickname.trim();
      const childBirth = getChildBirth(draftProfile);
      const currentChildBirth = getChildBirth(profile);
      const disabilityTypes = toApiDisabilityTypes(draftProfile.diagnoses);
      const currentDisabilityTypes = toApiDisabilityTypes(profile.diagnoses);

      if (nickname && nickname !== profile.parentNickname.trim()) {
        request.nickname = nickname;
      }

      if (childNickname && childNickname !== profile.childNickname.trim()) {
        request.childNickname = childNickname;
      }

      if (childBirth && childBirth !== currentChildBirth) {
        request.childBirth = childBirth;
      }

      if (!haveSameValues(disabilityTypes, currentDisabilityTypes)) {
        request.disabilityTypes = disabilityTypes;
      }

      if (draftProfile.region !== profile.region || draftProfile.district !== profile.district) {
        const regions = await queryClient.fetchQuery(myPageRegionsQueryOptions);
        const regionId = findRegionId(regions, draftProfile.region, draftProfile.district);

        if (regionId === undefined) {
          throw new Error("선택한 지역을 찾을 수 없습니다.");
        }

        request.regionId = regionId;
      }

      const hasProfileChanges = Object.keys(request).length > 0;

      if (hasProfileChanges) {
        await updateProfile(request);
      }

      let uploadedProfile: Awaited<ReturnType<typeof uploadProfileImage>> | null = null;

      if (draftProfile.profileImageFile) {
        try {
          uploadedProfile = await uploadProfileImage(draftProfile.profileImageFile);
        } catch (error) {
          if (!hasProfileChanges) {
            throw error;
          }

          await queryClient.invalidateQueries({
            queryKey: USER_DASHBOARD_QUERY_KEY,
          });

          let savedTextProfile: ProfileSettingsForm;

          try {
            const refreshedProfile = await queryClient.fetchQuery(myProfileQueryOptions);
            savedTextProfile = toProfileSettings(refreshedProfile);
          } catch {
            savedTextProfile = {
              ...cloneProfileSettings(draftProfile),
              profileImageUrl: profile.profileImageUrl,
              profileImageFile: null,
            };
            void queryClient.invalidateQueries({
              queryKey: USER_PROFILE_QUERY_KEY,
            });
          }

          saveProfile(savedTextProfile);
          setDraftProfile({
            ...cloneProfileSettings(savedTextProfile),
            profileImageFile: draftProfile.profileImageFile,
          });
          notifyUserProfileChanged();
          showToast(
            "yellow",
            "프로필 정보는 저장되었지만 이미지 업로드에 실패했습니다. 저장을 다시 시도해 주세요.",
          );
          return;
        }
      }

      if (uploadedProfile) {
        queryClient.setQueryData(USER_PROFILE_QUERY_KEY, uploadedProfile);
      }

      if (hasProfileChanges || uploadedProfile) {
        await queryClient.invalidateQueries({
          queryKey: USER_DASHBOARD_QUERY_KEY,
        });
      }

      let refreshedProfile = uploadedProfile;

      if (!refreshedProfile && hasProfileChanges) {
        try {
          refreshedProfile = await queryClient.fetchQuery(myProfileQueryOptions);
        } catch {
          showToast(
            "yellow",
            "프로필은 저장되었지만 최신 정보를 불러오지 못했습니다. 새로고침해 주세요.",
          );
          return;
        }
      }

      const nextProfile = refreshedProfile
        ? toProfileSettings(refreshedProfile)
        : cloneProfileSettings(profile);

      saveProfile(nextProfile);
      setDraftProfile(cloneProfileSettings(nextProfile));
      setIsEditing(false);

      if (hasProfileChanges || uploadedProfile) {
        notifyUserProfileChanged();
      }

      showToast("green", "프로필이 저장되었습니다.");
    } catch (error) {
      showToast("red", getApiErrorDetailMessage(error, "프로필을 저장하지 못했습니다."));
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="min-h-full bg-background-200 px-[32px] py-[20px]">
      <DetailBackButton className="ml-[24px]" />

      <div className="mx-auto mt-[18px] flex w-[634px] flex-col gap-[20px]">
        <ProfileManagementCard
          form={isEditing ? draftProfile : profile}
          joinedAt={joinedAt}
          guardianType={guardianType}
          badgeName={badgeName}
          isEditing={isEditing}
          onChange={setDraftProfile}
          onStartEdit={startEditing}
          onCancel={cancelEditing}
          onApply={applyEditing}
          isApplying={isApplying}
        />
        <AccountManagementCard onWithdraw={() => setIsWithdrawalModalOpen(true)} />
      </div>

      {isWithdrawalModalOpen && (
        <WithdrawalModal
          onClose={() => setIsWithdrawalModalOpen(false)}
          onConfirm={() => {
            setIsWithdrawalModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
