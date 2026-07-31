import ImagePlaceholder from "@/assets/images/news-img.svg";
import PostTag from "@/components/PostTag";
import ViewIcon from "@/assets/icons/Views.svg?react";
import { useNavigate } from "react-router-dom";

interface NewsCardProps {
  newsId: number;
  title: string;
  region: number;
  status: string;
  dDay: string;
  viewCount: number;
  thumbnailUrl?: string;
  onClick?: () => void;
}

export default function NewsCard({
  newsId,
  title,
  region,
  status,
  dDay,
  viewCount,
  thumbnailUrl,
}: NewsCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/news/${newsId}`)}
      className="shrink-0 w-[210px] overflow-hidden rounded-[8px] border border-background-250 bg-white text-left cursor-pointer"
    >
      <img
        src={thumbnailUrl || ImagePlaceholder}
        alt={title}
        className="h-[133px] w-full object-cover"
      />
      <div className="flex flex-col gap-[6px] py-[8px] px-[10px]">
        <p className="line-clamp-1 leading-none text-h6 text-background-600">{title}</p>

        <div className="text-body-label text-background-400">
          {region} · {status}
        </div>

        <div className="flex items-center">
          <PostTag type="ETC" label={`D-${dDay}`} />
          
          
          <ViewIcon className="h-[12px] w-[12px] ml-[8px] mr-[4px]" />
          <span className="text-body-sub leading-none text-background-500 mr-[4px]">조회</span>
          <span className="text-h4-list leading-none text-gray-500">{viewCount}</span>
        </div>
      </div>
    </button>
  );
}