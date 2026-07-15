import BellIcon from "@/assets/icons/Bell.svg?react";

interface NoticeBannerProps {
  title: string;
  description: string;
  buttonText?: string;
  onClick?: () => void;
}

export default function NoticeBanner({
  title,
  description,
  buttonText = "자세히 보기",
  onClick,
}: NoticeBannerProps) {
  return (
    <div className="flex overflow-hidden items-center justify-between rounded-[10px] border border-sub-yellow bg-background-100 px-[18px] py-[12px] shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-sub-yellow shrink-0">
          <BellIcon className="h-[14px] w-[14px] text-white " />
        </div>

        <div>
          <div className="flex items-center gap-1 text-h6 text-sub-yellow shrink-0">
            <span>📢</span>
            <span>{title}</span>
          </div>

          <p className="text-body-sub text-background-500">{description}</p>
        </div>
      </div>

      <button
        onClick={onClick}
        className="rounded-[5px] bg-sub-yellow px-[5.5px] py-[4px] text-body-label text-background-100 shrink-0"
      >
        {buttonText}
      </button>
    </div>
  );
}