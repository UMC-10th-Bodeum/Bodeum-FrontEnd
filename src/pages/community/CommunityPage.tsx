import { useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { hasStoredAuthSession } from "@/apis/authApi";
import CategoryButton from "@/components/CategoryButton";
import Input from "@/components/Input";
import Pagination from "@/components/pagination/Pagination";
import { Select } from "@/components/Select";
import { showToast } from "@/components/Toast";
import {
  communityCategoryEntries,
  communityCategoryCodeMap,
  communityCategoryMap,
  getCommunityCategoryByCode,
  isCommunityCategoryCode,
  type CommunityCategory,
} from "@/constants/communityCategory";
import { useCommunityPostSearchSuggestions, useCommunityPosts } from "@/hooks/useCommunity";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useUserBrief } from "@/hooks/useUser";
import type { CommunityPostSort } from "@/types/community";
import { formatDate } from "@/utils/time";
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
  { label: "최신순", value: "latest" },
  { label: "조회순", value: "view" },
  { label: "공감순", value: "like" },
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

export default function CommunityPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: userBrief, isError: isUserBriefError, refetch: refetchUserBrief } = useUserBrief();
  const accessCheckInFlight = useRef(false);
  const isLoggedIn =
    !isUserBriefError && hasStoredAuthSession() && userBrief?.isLoggedIn === true;
  const categoryCodeParam = searchParams.get("categoryCode");
  const category: CommunityCategory | "ALL" = isCommunityCategoryCode(categoryCodeParam)
    ? getCommunityCategoryByCode(categoryCodeParam)
    : "ALL";
  const [inputKeyword, setInputKeyword] = useState("");
  const [keyword, setKeyword] = useState("");
  const location = useLocation();
  const routeSort = (location.state as { sort?: unknown } | null | undefined)?.sort;
  const initialSort: CommunityPostSort | "" =
    routeSort === "latest" ||
    routeSort === "view" ||
    routeSort === "like" ||
    routeSort === "comment"
      ? routeSort
      : "";

  const [sort, setSort] = useState<CommunityPostSort | "">(initialSort);
  const [page, setPage] = useState(1);
  const debouncedInputKeyword = useDebouncedValue(inputKeyword.trim(), 300);
  const { data: suggestions = [] } = useCommunityPostSearchSuggestions(debouncedInputKeyword);
  const { data, isPending, isError, refetch } = useCommunityPosts({
    page: page - 1,
    size: 14,
    sort: sort || undefined,
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

  const runAfterLoginCheck = async (onAuthenticated: () => void) => {
    if (accessCheckInFlight.current) {
      return;
    }

    if (!hasStoredAuthSession()) {
      showToast("blue", "로그인/회원가입 후 만나보세요");
      return;
    }

    accessCheckInFlight.current = true;

    try {
      const result = await refetchUserBrief();
      const canWrite =
        !result.isError && hasStoredAuthSession() && result.data?.isLoggedIn === true;

      if (!canWrite) {
        showToast("blue", "로그인/회원가입 후 만나보세요");
        return;
      }

      onAuthenticated();
    } finally {
      accessCheckInFlight.current = false;
    }
  };

  const handleWriteClick = () => {
    void runAfterLoginCheck(() => navigate("/community/write"));
  };

  const handlePostClick = (postId: number) => {
    void runAfterLoginCheck(() => navigate(`/community/${postId}`));
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-background-100">
      <div className="mx-auto flex max-w-[1440px] flex-col px-[32px] py-[20px]">
        <CommunitySection
          onWriteClick={handleWriteClick}
          onPostClick={handlePostClick}
        />

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
              placeholder={isLoggedIn ? "최신순" : "조회순"}
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
                    categoryLabel={communityCategoryMap[postCategory]}
                    title={post.title}
                    content={post.content}
                    likes={post.likeCount}
                    comments={post.commentCount}
                    views={post.viewCount}
                    imageCount={post.thumbnailUrl ? 1 : 0}
                    initialIsLiked={post.isLiked}
                    createdAt={formatDate(post.createdAt)}
                    onClick={() => handlePostClick(post.postId)}
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
