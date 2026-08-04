import CommentIcon from "@/assets/icons/Comment.svg?react";
import PostIcon from "@/assets/icons/Post.svg?react";
import ScrapIcon from "@/assets/icons/Scrap.svg?react";
import Chip from "@/components/Chips";
import DetailBackButton from "@/components/DetailBackButton";
import { Link } from "react-router-dom";
import type { MyPageItem } from "../types";

interface MyPageCardProps {
  item: MyPageItem;
  onDelete?: () => void;
  deleteDisabled?: boolean;
}

export default function MyPageCard({
  item,
  onDelete,
  deleteDisabled = false,
}: MyPageCardProps) {
  const isComment = item.type === "comment";
  const isScrap = item.type === "scrap";
  const content = isComment ? item.comment : item.title;
  const meta = isComment
    ? ["커뮤니티 댓글", item.postTitle, `작성일 ${item.date}`]
        .filter(Boolean)
        .join(" · ")
    : `${isScrap ? (item.sourceLabel ?? "저장 정보") : "커뮤니티 게시글"} · ${
        isScrap ? "저장일" : "작성일"
      } ${item.date}`;
  const targetPath = isScrap && item.targetPath
    ? item.targetPath
    : `/community/${item.postId}`;

  return (
    <article className="relative flex w-[577px] items-center rounded-[10px] border border-background-250 bg-background-100 px-[17px] py-[15px] transition-[border-color,box-shadow] duration-300 ease-out hover:shadow-[1px_2px_15px_0px_#00000026] has-[a:active]:border-main-400">
      <Link
        to={targetPath}
        className="flex min-w-0 flex-1 items-center self-stretch before:pointer-events-none before:absolute before:inset-0 before:rounded-[10px] focus-visible:outline-none focus-visible:before:outline focus-visible:before:outline-2 focus-visible:before:outline-offset-2"
        aria-label={`${content} 상세 보기`}
      >
        <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[10px] bg-background-200">
          {isComment ? (
            <CommentIcon
              className="h-[13.52px] w-[15.01px] text-background-600"
              aria-hidden="true"
            />
          ) : item.type === "post" ? (
            <PostIcon className="h-[15.75px] w-[15.75px]" aria-hidden="true" />
          ) : (
            <ScrapIcon className="h-[18px] w-[18px] [&_path]:stroke-[1.2]" aria-hidden="true" />
          )}
        </div>

        <div className="ml-[12px] min-w-0">
          <h3 className="truncate text-h3-category-sub text-background-600">{content}</h3>
          <p className="mt-[3px] text-h6-list text-background-500">{meta}</p>
        </div>

        {isScrap && item.dDay && (
          <Chip variant="dday" className="ml-auto shrink-0 w-[54px] h-[36px]">
            {item.dDay}
          </Chip>
        )}
      </Link>

      {onDelete && (
        <DetailBackButton
          icon={null}
          label="삭제"
          onClick={onDelete}
          disabled={deleteDisabled}
          className="ml-[12px] h-[36px] w-[56px] shrink-0 justify-center !px-0 !py-0"
        />
      )}
    </article>
  );
}
