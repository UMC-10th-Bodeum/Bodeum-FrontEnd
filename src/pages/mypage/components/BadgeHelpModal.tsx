import CloseModalFrame from "@/components/CloseModalFrame";

interface BadgeHelpModalProps {
  onClose: () => void;
}

export default function BadgeHelpModal({ onClose }: BadgeHelpModalProps) {
  return (
    <CloseModalFrame
      leftButtonText=""
      rightButtonText=""
      showFooter={false}
      onClose={onClose}
      className="!h-fit !w-fit max-w-[calc(100vw-40px)] !py-[48px]"
      overlayClassName="!bg-black/50"
    >
      <section aria-label="보듬 뱃지란?" className="relative">
        <h2 className="text-h1-onboard text-background-600">보듬 뱃지가 뭔가요?</h2>

        <div className="mt-[20px] rounded-[8px] bg-background-200 p-[12px] text-h2-onboard text-background-500">
          <p>
            보듬 커뮤니티는 부모님들의 소중한 경험을 가장 중요한 자산으로 여깁니다.
            <br />
            이웃의 질문에 따뜻한 <strong className="text-h2-list text-main-400">답변</strong>을
            건네거나, 유익한 정보를 <strong className="text-h2-list text-main-400">공유</strong>할
            때마다 포인트가 쌓여갑니다.
          </p>
          <br />
          <p>
            모아진 포인트에 따라{" "}
            <strong className="text-h2-list text-main-400">새싹 ➜ 잎새 ➜ 꽃 ➜ 열매 ➜ 나무</strong>{" "}
            단계로 등급이 자라납니다.
            <br />
            새싹에서 시작해 단단한 나무가 되기까지, 서로의 버팀목이 되어주는 신뢰의 여정에 함께해
            주세요.
          </p>
        </div>
      </section>
    </CloseModalFrame>
  );
}
