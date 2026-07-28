import { useEffect, useState } from "react";

import ProfileIcon from "@/assets/icons/Profile.svg?react";
import ButtonFill from "@/components/ButtonFill";
import { communityCommentMocks } from "@/mocks/communityComments";
import CommentEmptyState from "./CommentEmptyState";
import CommunityCommentItem from "./CommunityCommentItem";
import type { CommunityComment } from "@/types/community";

interface CommunityCommentsSectionProps {
  storageKey: string;
  totalCount?: number;
}

export default function CommunityCommentsSection({
  storageKey,
  totalCount,
}: CommunityCommentsSectionProps) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<CommunityComment[]>(() => {
    try {
      const savedComments = localStorage.getItem(storageKey);
      if (savedComments) {
        const parsedComments = JSON.parse(savedComments) as CommunityComment[];
        if (parsedComments.length > 0) return parsedComments;
      }

      return communityCommentMocks;
    } catch {
      return communityCommentMocks;
    }
  });
  const [replyTargetId, setReplyTargetId] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(comments));
  }, [comments, storageKey]);

  const submitComment = () => {
    const value = comment.trim();
    if (!value) return;

    setComments((current) => [
      ...current,
      {
        id: Date.now(),
        author: "나",
        createdAt: "방금 전",
        content: value,
        likes: 0,
      },
    ]);
    setComment("");
  };

  const submitReply = (parentCommentId: number, content: string) => {
    setComments((current) =>
      current.map((item) =>
        item.id === parentCommentId
          ? {
              ...item,
              replies: [
                ...(item.replies ?? []),
                {
                  id: Date.now(),
                  author: "나",
                  createdAt: "방금 전",
                  content,
                  likes: 0,
                },
              ],
            }
          : item,
      ),
    );
  };

  return (
    <section className="pt-[16px]">
      <p className="text-h2-list text-background-600">
        댓글{" "}
        <span className="ml-[8px] text-main-400">
          {totalCount === undefined
            ? comments.length
            : totalCount + comments.length - communityCommentMocks.length}
        </span>
      </p>

      <div className="mt-[16px] flex items-center gap-[26.5px]">
        <ProfileIcon className="h-[40px] w-[40px] shrink-0" />
        <input
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return;
            if (event.key === "Enter") submitComment();
          }}
          placeholder="이웃 부모에게 따뜻한 댓글을 남겨주세요"
          className="h-[44px] w-[947px] flex-1 rounded-[10px] border border-transparent bg-background-200 px-[16px] text-h4-list text-background-600 outline-none placeholder:text-background-500 focus:border-main-400"
        />
        <ButtonFill
          label="등록"
          disabled={!comment.trim()}
          onClick={submitComment}
          className="!h-[44px] !bg-main-400 !text-background-100"
        />
      </div>

      {comments.length === 0 ? (
        <CommentEmptyState />
      ) : (
        <ul className="mt-[18px]">
          {comments.map((item) => (
            <CommunityCommentItem
              key={item.id}
              comment={item}
              replyFormOpen={replyTargetId === item.id}
              onToggleReplyForm={() =>
                setReplyTargetId((current) => (current === item.id ? null : item.id))
              }
              onSubmitReply={submitReply}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
