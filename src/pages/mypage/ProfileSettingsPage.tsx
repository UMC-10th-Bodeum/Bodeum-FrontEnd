import { useState } from "react";
import DetailBackButton from "@/components/DetailBackButton";
import AccountManagementCard from "./settings/AccountManagementCard";
import ProfileManagementCard from "./settings/ProfileManagementCard";
import WithdrawalModal from "./settings/components/WithdrawalModal";
import type { ProfileSettingsForm } from "./settings/types";
import { useMyPageProfile } from "./myPageProfileContext";

const cloneProfileSettings = (profile: ProfileSettingsForm): ProfileSettingsForm => ({
  ...profile,
  diagnoses: [...profile.diagnoses],
});

export default function ProfileSettingsPage() {
  const { profile, saveProfile } = useMyPageProfile();
  const [draftProfile, setDraftProfile] = useState(() => cloneProfileSettings(profile));
  const [isEditing, setIsEditing] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  const startEditing = () => {
    setDraftProfile(cloneProfileSettings(profile));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraftProfile(cloneProfileSettings(profile));
    setIsEditing(false);
  };

  const applyEditing = () => {
    saveProfile(draftProfile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-full bg-background-200 px-[32px] py-[20px]">
      <DetailBackButton className="ml-[24px]" />

      <div className="mx-auto mt-[18px] flex w-[634px] flex-col gap-[20px]">
        <ProfileManagementCard
          form={isEditing ? draftProfile : profile}
          isEditing={isEditing}
          onChange={setDraftProfile}
          onStartEdit={startEditing}
          onCancel={cancelEditing}
          onApply={applyEditing}
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
