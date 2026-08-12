interface AccountManagementCardProps {
  onWithdraw: () => void;
}

export default function AccountManagementCard({ onWithdraw }: AccountManagementCardProps) {
  return (
    <section className="w-[634px] rounded-[20px] bg-background-100 p-[20px]">
      <h2 className="border-b border-background-300 py-[8px] text-h2-list text-background-600">
        보안 및 로그인
      </h2>
      <button
        type="button"
        onClick={onWithdraw}
        className="mt-[16px] cursor-pointer text-h3-category-sub text-sub-red"
      >
        회원탈퇴
      </button>
    </section>
  );
}
