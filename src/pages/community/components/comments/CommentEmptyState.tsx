import StarIcon from "@/assets/icons/Star.svg?react";

export default function CommentEmptyState() {
  return (
    <div className="mt-[18px] flex h-[124px] flex-col items-center justify-center text-center">
      <StarIcon aria-hidden="true" className="mb-[8px] h-[44px] w-[46px]" />
      <p className="text-h4-list text-background-600">아직 댓글이 없어요</p>
      <p className="text-h6-list text-background-500">이웃 부모에게 소중한 첫 답변을 남겨주세요.</p>
    </div>
  );
}
