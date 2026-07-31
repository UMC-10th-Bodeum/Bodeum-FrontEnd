import { useState } from "react";

interface CommunityReplyFormProps {
  targetAuthor: string;
  onCancel: () => void;
  onSubmit: (content: string) => void;
}

export default function CommunityReplyForm({
  targetAuthor,
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
    setReply("");
    onCancel();
  };

  return (
    <div className="relative ml-[18px] mt-[18px] bg-background-200 px-[70px] py-[18px] before:absolute before:left-[17px] before:top-[18px] before:h-[25px] before:w-[25px] before:border-b before:border-l before:border-background-300">
      <textarea
        value={reply}
        onChange={(event) => setReply(event.target.value)}
        placeholder={`${targetAuthor}에게 답글 쓰기`}
        className="h-[100px] w-full resize-none rounded-[9px] border border-background-300 bg-background-100 px-[16px] py-[14px] text-h6-list text-background-600 outline-none placeholder:text-background-500 focus:border-main-400"
      />
      <div className="mt-[10px] flex justify-end gap-[8px]">
        <button
          type="button"
          onClick={cancelReply}
          className="h-[30px] cursor-pointer rounded-[6px] border border-main-400 px-[16px] text-body-label text-main-400"
        >
          취소
        </button>
        <button
          type="button"
          onClick={submitReply}
          className="h-[30px] cursor-pointer rounded-[6px] bg-main-400 px-[16px] text-body-label text-background-100"
        >
          작성
        </button>
      </div>
    </div>
  );
}
