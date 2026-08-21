import { useState } from "react";
import DetailBackButton from "@/components/button/DetailBackButton";
import AccountManagementCard from "./components/settings/AccountManagementCard";
import WithdrawalModal from "./components/settings/WithdrawalModal";
import ProfileManagementCard from "./components/settings/ProfileManagementCard";
import { useProfileSettingsForm } from "./hooks/useProfileSettingsForm";

export default function ProfileSettingsPage() {
  const settings = useProfileSettingsForm();
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  return (
    <div className="min-h-full bg-background-200 px-[32px] py-[20px]">
      <div className="grid grid-cols-1 items-start">
        <DetailBackButton className="sticky top-[20px] z-10 col-start-1 row-start-1 ml-[24px] justify-self-start" />

        <div className="col-start-1 row-start-1 mx-auto flex w-[634px] flex-col gap-[20px]">
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
          />
          <AccountManagementCard onWithdraw={() => setIsWithdrawalModalOpen(true)} />
        </div>
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
