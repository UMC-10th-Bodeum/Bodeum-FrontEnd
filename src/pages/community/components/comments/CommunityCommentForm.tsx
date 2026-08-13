import { useState } from "react";

import ButtonFill from "@/components/button/ButtonFill";
import ProfileAvatar from "@/components/ProfileAvatar";
import { useUserBrief } from "@/hooks/useUser";

interface CommunityCommentFormProps {
  isSubmitting: boolean;
  onSubmit: (content: string, onSuccess: () => void) => void;
}

export default function CommunityCommentForm({
  isSubmitting,
  onSubmit,
}: CommunityCommentFormProps) {
  const [comment, setComment] = useState("");
  const { data: userBrief } = useUserBrief();

  const content = comment.trim();

  return (
    <>
      <form
        className="mt-[16px] flex items-center gap-[26.5px]"
        onSubmit={(event) => {
          event.preventDefault();
          if (!content || isSubmitting) return;
          onSubmit(content, () => setComment(""));
        }}
      >
        <ProfileAvatar
          imageUrl={userBrief?.isLoggedIn ? userBrief.profileImageUrl : null}
          alt="내 프로필"
          className="h-[40px] w-[40px]"
        />
        <input
          value={comment}
          disabled={isSubmitting}
          onChange={(event) => setComment(event.target.value)}
          placeholder="이웃 부모에게 따뜻한 댓글을 남겨주세요"
          className={`h-[44px] w-[947px] flex-1 rounded-[10px] border px-[18px] py-[10px] text-h4-list text-background-600 outline-none placeholder:text-background-500 focus:border-main-400 focus:bg-background-100 disabled:cursor-not-allowed disabled:opacity-50 ${
            comment.length > 0
              ? "border-main-400 bg-background-100"
              : "border-transparent bg-main-100"
          }`}
        />
        <ButtonFill
          type="submit"
          label="등록"
          disabled={!content || isSubmitting}
          className="!h-[44px]"
        />
      </form>
      <p className="mt-2 pl-[66.5px] text-body-sub text-background-400">
        욕설·비방·광고성 링크가 포함된 댓글은 별도 안내 없이 삭제될 수 있습니다.
      </p>
    </>
  );
}
