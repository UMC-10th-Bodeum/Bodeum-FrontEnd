import { useState } from "react";
import MainButton from "@/components/MainButton";

interface CommunityReplyFormProps {
  targetAuthor: string;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (content: string) => void;
}

export default function CommunityReplyForm({
  targetAuthor,
  isSubmitting,
  onCancel,
  onSubmit,
}: CommunityReplyFormProps) {
  const [reply, setReply] = useState("");

  const cancelReply = () => {
    setReply("");
    onCancel();
  };

  const submitReply = () => {
    const value = reply.trim();
    if (!value) return;

    onSubmit(value);
  };

  return (
    <div className="relative border-y border-background-250 bg-background-200 py-[20px] px-[80px]">
      <span
        aria-hidden="true"
        className="absolute top-[20px] left-[17px] flex h-[40px] w-[40px] items-center justify-center"
      >
        <span className="h-[24px] w-[24px] border-b border-l border-background-300" />
      </span>
      <textarea
        value={reply}
        maxLength={1000}
        disabled={isSubmitting}
        onChange={(event) => setReply(event.target.value)}
        placeholder={`${targetAuthor}에게 답글 쓰기`}
        className="h-[100px] w-full resize-none rounded-[9px] border border-background-300 bg-background-100 px-[16px] py-[14px] text-h6-list text-background-600 outline-none placeholder:text-background-500 focus:border-main-400 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div className="mt-[10px] flex justify-end gap-[8px]">
        <MainButton size="S" stroke disabled={isSubmitting} onClick={cancelReply}>
          취소
        </MainButton>
        <MainButton size="S" disabled={!reply.trim() || isSubmitting} onClick={submitReply}>
          작성
        </MainButton>
      </div>
    </div>
  );
}
