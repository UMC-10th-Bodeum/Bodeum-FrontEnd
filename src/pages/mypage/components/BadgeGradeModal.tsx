import CloseModalFrame from "@/components/CloseModalFrame";

interface BadgeGradeModalProps {
  onClose: () => void;
}

const pointActivities = [
  {
    title: "게시글 작성 (+5점)",
    description: "모든 게시판에 소중한 경험이나 질문 글을 남겨주세요. (하루 최대 3글까지 인정)",
  },
  {
    title: "따뜻한 답변 달기 (+4점)",
    description: "이웃 부모님의 글에 공감과 조언의 댓글을 달아주세요. (적립 제한 없음)",
  },
  {
    title: "이웃에게 '도움돼요' 받기 (+5점)",
    description: "내가 쓴 글이나 답변이 다른 부모님에게 유익한 공감을 얻었을 때 쌓입니다.",
  },
  {
    title: "최고의 지혜로 채택되기 (+20점)",
    description:
      "'질문글'에 정성스러운 답변을 남겨 질문한 부모님에게 채택되었을 때 받게 되는 특별한 포인트입니다.",
  },
];

export default function BadgeGradeModal({ onClose }: BadgeGradeModalProps) {
  return (
    <CloseModalFrame
      leftButtonText=""
      rightButtonText=""
      showFooter={false}
      onClose={onClose}
      className="!h-fit !w-fit max-w-[calc(100vw-40px)] !py-[48px]"
      overlayClassName="!bg-black/50"
    >
      <section aria-labelledby="badge-grade-title" className="flex flex-col gap-[20px]">
        <h2 id="badge-grade-title" className="text-h1-onboard text-background-600">
          지혜를 나누고 보듬 뱃지를 키워보세요.
          <br />
          보듬 커뮤니티에서 이웃과 마음을 나누면 포인트가 차곡차곡 쌓입니다.
        </h2>

        <ul className="flex flex-col gap-[20px]">
          {pointActivities.map((activity) => (
            <li key={activity.title} className="rounded-[8px] bg-background-200 p-[12px]">
              <h3 className="text-h2-list text-main-400">{activity.title}</h3>
              <p className="mt-[4px] text-h2-onboard text-background-500">{activity.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </CloseModalFrame>
  );
}
