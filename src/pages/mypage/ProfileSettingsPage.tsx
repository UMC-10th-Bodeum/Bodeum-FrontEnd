import { useState } from "react";
import DetailBackButton from "@/components/DetailBackButton";
import AccountManagementCard from "./settings/components/AccountManagementCard";
import WithdrawalModal from "./settings/components/WithdrawalModal";
import ProfileManagementCard from "./settings/ProfileManagementCard";
import { useProfileSettingsForm } from "./hooks/useProfileSettingsForm";

export default function ProfileSettingsPage() {
  const settings = useProfileSettingsForm();
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  return (
    <div className="min-h-full bg-background-200 px-[32px] py-[20px]">
      <DetailBackButton className="ml-[24px]" />

      <div className="mx-auto mt-[18px] flex w-[634px] flex-col gap-[20px]">
        <ProfileManagementCard
          form={settings.displayedProfile}
          joinedAt={settings.joinedAt}
          guardianType={settings.guardianType}
          badgeName={settings.badgeName}
          isEditing={settings.isEditing}
          onChange={settings.setDraftProfile}
          onStartEdit={settings.startEditing}
          onCancel={settings.cancelEditing}
          onApply={settings.applyEditing}
          isApplying={settings.isApplying}
          regions={settings.regions}
          isRegionsLoading={settings.isRegionsLoading}
          regionsError={settings.regionsError}
          onRetryRegions={() => void settings.retryRegions()}
        />
        <AccountManagementCard onWithdraw={() => setIsWithdrawalModalOpen(true)} />
      </div>

      {isWithdrawalModalOpen && (
        <WithdrawalModal
          onClose={() => setIsWithdrawalModalOpen(false)}
          onConfirm={() => setIsWithdrawalModalOpen(false)}
        />
      )}
    </div>
  );
}
