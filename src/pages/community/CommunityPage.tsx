import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import CategoryButton from "@/components/CategoryButton";
import Input from "@/components/Input";
import Pagination from "@/components/pagination/Pagination";
import { Select } from "@/components/Select";
import {
  communityCategoryEntries,
  communityCategoryCodeMap,
  communityCategoryMap,
  getCommunityCategoryByCode,
  isCommunityCategoryCode,
  type CommunityCategory,
} from "@/constants/communityCategory";
import {
  useCommunityPostSearchSuggestions,
  useCommunityPosts,
} from "@/hooks/useCommunity";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { CommunityPostSort } from "@/types/community";
import CommunityPostCard from "./components/CommunityPostCard";
import CommunitySection from "./components/CommunitySection";

const categories: Array<{
  value: CommunityCategory | "ALL";
  label: string;
}> = [
  { value: "ALL", label: "전체" },
  ...communityCategoryEntries.map(([value, label]) => ({ value, label })),
];

const sortOptions = [
  { label: "조회순", value: "view" },
  { label: "스크랩순", value: "scrap" },
  { label: "댓글순", value: "comment" },
];

function getCommunityCategory(boardType: string): CommunityCategory {
  if (boardType.includes("GROWTH") || boardType.includes("THERAPY")) {
    return "GROWTH_RECORD";
  }
  if (boardType.includes("LOCAL") || boardType.includes("NEIGHBOR")) {
    return "LOCAL_NEWS";
  }
  if (boardType.includes("REVIEW") || boardType.includes("CENTER")) {
    return "CENTER_REVIEW";
  }
  if (boardType.includes("QUESTION") || boardType.includes("INFORMATION")) {
    return "QUESTION";
  }
  return "FREE";
}

function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return createdAt;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export default function CommunityPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryCodeParam = searchParams.get("categoryCode");
  const category: CommunityCategory | "ALL" = isCommunityCategoryCode(categoryCodeParam)
    ? getCommunityCategoryByCode(categoryCodeParam)
    : "ALL";
  const [inputKeyword, setInputKeyword] = useState("");
  const [keyword, setKeyword] = useState("");
  const location = useLocation();
  const routeSort = (location.state as { sort?: unknown } | null | undefined)?.sort;
  const initialSort: CommunityPostSort =
    routeSort === "view" || routeSort === "scrap" || routeSort === "comment"
      ? routeSort
      : "view";

  const [sort, setSort] = useState<CommunityPostSort>(initialSort);
  const [page, setPage] = useState(1);
  const debouncedInputKeyword = useDebouncedValue(inputKeyword.trim(), 300);
  const { data: suggestions = [] } =
    useCommunityPostSearchSuggestions(debouncedInputKeyword);
  const { data, isPending, isError, refetch } = useCommunityPosts({
    page: page - 1,
    size: 14,
    sort: sort || "view",
    keyword,
    categoryCode: category === "ALL" ? undefined : communityCategoryCodeMap[category],
  });
  const visiblePosts = data?.content ?? [];

  const selectCategory = (value: CommunityCategory | "ALL") => {
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);

        if (value === "ALL") {
          nextParams.delete("categoryCode");
        } else {
          nextParams.set("categoryCode", communityCategoryCodeMap[value]);
        }

        return nextParams;
      },
      { replace: true },
    );
    setPage(1);
  };

  const handleSearch = (nextKeyword: string) => {
    const normalizedKeyword = nextKeyword.trim();
    setInputKeyword(nextKeyword);
    setKeyword(normalizedKeyword.length >= 2 ? normalizedKeyword : "");
    setPage(1);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-background-100">
      <div className="mx-auto flex max-w-[1440px] flex-col px-[32px] py-[20px]">
        <CommunitySection />

        <div className="mt-[18px] flex flex-col gap-[16px]">
          <div className="flex flex-wrap gap-[16px]">
            {categories.map((item) => (
              <CategoryButton
                key={item.value}
                label={item.label}
                category="HOSPITAL"
                selected={category === item.value}
                onClick={() => selectCategory(item.value)}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-6">
            <Input
              search
              searchType="community"
              value={inputKeyword}
              onChange={(event) => {
                const nextKeyword = event.target.value;
                setInputKeyword(nextKeyword);
                if (!nextKeyword.trim()) handleSearch("");
              }}
              onEnter={handleSearch}
              suggestions={suggestions}
              onSuggestionClick={handleSearch}
              placeholder="게시글을 검색해보세요"
              className="h-[44px] w-[640px]"
            />
            <Select
              options={sortOptions}
              value={sort}
              onChange={(value) => {
                setSort(value as CommunityPostSort);
                setPage(1);
              }}
              placeholder="조회순"
              variant="S"
              ariaLabel="게시글 정렬"
              className="w-[120px]"
            />
          </div>

          {isPending ? (
            <div className="flex items-center justify-center py-16 text-center text-background-500">
              게시글을 불러오는 중입니다.
            </div>
          ) : isError ? (
            <div className="min-h-[320px] flex flex-col items-center justify-center gap-3 text-background-500">
              <p>게시글을 불러오지 못했습니다.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-lg border border-background-300 px-4 py-2"
              >
                다시 시도
              </button>
            </div>
          ) : visiblePosts.length === 0 ? (
            <div className="py-16 text-center text-background-500">검색 결과가 없습니다.</div>
          ) : (
            <div className="grid grid-cols-2 gap-x-[20px] gap-y-[12px]">
              {visiblePosts.map((post) => {
                const postCategory = getCommunityCategory(post.boardType);

                return (
                  <CommunityPostCard
                    key={post.postId}
                    id={post.postId}
                    categoryLabel={communityCategoryMap[postCategory]}
                    title={post.title}
                    content={post.content}
                    likes={post.likeCount}
                    comments={post.commentCount}
                    views={post.viewCount}
                    imageCount={post.thumbnailUrl ? 1 : 0}
                    initialIsLiked={post.isLiked}
                    createdAt={formatCreatedAt(post.createdAt)}
                    onClick={() => navigate(`/community/${post.postId}`)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {data && data.totalPages > 1 && (
          <div className="mt-[5px] py-2">
            <Pagination currentPage={page} totalPages={data.totalPages} onChange={setPage} />
          </div>
        )}
      </div>

    </div>
  );
}
