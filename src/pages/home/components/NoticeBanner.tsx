import BellIcon from "@/assets/icons/Bell.svg?react";
import { useHomeBanner } from "@/hooks/useHome";
import { useNavigate } from "react-router-dom";

export default function NoticeBanner() {
  const { data: banner, isLoading } = useHomeBanner();
  const navigate = useNavigate();

  if (isLoading || !banner) return null;

  const handleClick = () => {
    navigate(`/news/${banner.newsId}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full items-center justify-between overflow-hidden rounded-[10px] border border-sub-yellow bg-background-100 px-[18px] py-[12px] text-left cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-sub-yellow shrink-0">
            <BellIcon className="h-[14px] w-[14px] text-white " />
          </div>

          <div>
            <div className="flex items-center gap-1 text-h6 text-sub-yellow shrink-0">
              <span>📢</span>
              <span className="truncate">
                {banner.title}
                {banner.dDay != null && ` — D-${banner.dDay}`}
              </span>
            </div>

            <p className="text-body-sub text-background-500">
              {banner.summary ?? "공지사항을 확인해 주세요."}
            </p>
          </div>
        </div>
      </div>

      <div className="shrink-0 rounded-[5px] bg-sub-yellow px-[5.5px] py-[4px] text-body-label text-background-100">
        자세히 보기
      </div>
    </button>
  );
}