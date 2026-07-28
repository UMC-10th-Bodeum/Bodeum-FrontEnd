import { useState } from "react";
import DetailBackButton from "@/components/DetailBackButton";
import AccountManagementCard from "./settings/AccountManagementCard";
import { initialProfileSettings } from "./settings/data";
import ProfileManagementCard from "./settings/ProfileManagementCard";
import WithdrawalModal from "./settings/components/WithdrawalModal";
import type { ProfileSettingsForm } from "./settings/types";

const cloneProfileSettings = (profile: ProfileSettingsForm): ProfileSettingsForm => ({
  ...profile,
  diagnoses: [...profile.diagnoses],
});

export default function ProfileSettingsPage() {
  const [savedProfile, setSavedProfile] = useState(initialProfileSettings);
  const [draftProfile, setDraftProfile] = useState(initialProfileSettings);
  const [isEditing, setIsEditing] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  const startEditing = () => {
    setDraftProfile(cloneProfileSettings(savedProfile));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraftProfile(cloneProfileSettings(savedProfile));
    setIsEditing(false);
  };

  const applyEditing = () => {
    setSavedProfile(cloneProfileSettings(draftProfile));
    setIsEditing(false);
  };

  return (
    <div className="min-h-full bg-background-200 px-[32px] py-[20px]">
      <DetailBackButton className="ml-[24px]" />

      <div className="mx-auto mt-[18px] flex w-[634px] flex-col gap-[20px]">
        <ProfileManagementCard
          form={isEditing ? draftProfile : savedProfile}
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
