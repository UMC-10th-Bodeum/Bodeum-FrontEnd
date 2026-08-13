import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import AsyncState from "@/components/AsyncState";
import CategoryButton from "@/components/button/CategoryButton";
import OnboardCancelBox from "@/components/OnboardCancelBox";
import Pagination from "@/components/pagination/Pagination";
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
import { useLoginCheck } from "@/hooks/useLoginCheck";
import type { CommunityPostSort } from "@/types/community";
import { formatDate } from "@/utils/time";
import CommunityPostCard from "./components/CommunityPostCard";
import CommunitySection from "./components/CommunitySection";
import CommunityToolbar from "./components/CommunityToolbar";

const categories: Array<{
  value: CommunityCategory | "ALL";
  label: string;
}> = [
  { value: "ALL", label: "전체" },
  ...communityCategoryEntries.map(([value, label]) => ({ value, label })),
];

function isCommunityPostSort(value: unknown): value is CommunityPostSort {
  return value === "latest" || value === "view" || value === "like" || value === "comment";
}

export default function CommunityPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showLoginModal, setShowLoginModal] = useState(
    () =>
      (location.state as { showLoginModal?: unknown } | null)?.showLoginModal === true,
  );
  const { isLoggedIn, runAfterLoginCheck } = useLoginCheck();
  const categoryCodeParam = searchParams.get("categoryCode");
  const category: CommunityCategory | "ALL" = isCommunityCategoryCode(categoryCodeParam)
    ? getCommunityCategoryByCode(categoryCodeParam)
    : "ALL";
  const sortParam = searchParams.get("sort");
  const sort: CommunityPostSort | "" = isCommunityPostSort(sortParam) ? sortParam : "";
  const keyword = searchParams.get("keyword")?.trim() ?? "";
  const parsedPage = Number(searchParams.get("page"));
  const page = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const [inputKeyword, setInputKeyword] = useState(keyword);
  const debouncedInputKeyword = useDebouncedValue(inputKeyword.trim(), 300);
  const { data: suggestions = [], isPending: areSuggestionsPending } =
    useCommunityPostSearchSuggestions(debouncedInputKeyword);
  const areSuggestionsLoading =
    inputKeyword.trim().length >= 2 &&
    (inputKeyword.trim() !== debouncedInputKeyword || areSuggestionsPending);
  const { data, isPending, isError } = useCommunityPosts({
    page: page - 1,
    size: 14,
    sort: sort || undefined,
    keyword,
    categoryCode: category === "ALL" ? undefined : communityCategoryCodeMap[category],
  });
  const visiblePosts = data?.content ?? [];

  useEffect(() => {
    setInputKeyword(keyword);
  }, [keyword]);

  useEffect(() => {
    if ((location.state as { showLoginModal?: unknown } | null)?.showLoginModal !== true) {
      return;
    }

    navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
  }, [location.pathname, location.search, location.state, navigate]);

  const selectCategory = (value: CommunityCategory | "ALL") => {
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);

        if (value === "ALL") {
          nextParams.delete("categoryCode");
        } else {
          nextParams.set("categoryCode", communityCategoryCodeMap[value]);
        }
        nextParams.set("page", "1");

        return nextParams;
      },
      { replace: true },
    );
  };

  const handleSearch = (nextKeyword: string) => {
    const normalizedKeyword = nextKeyword.trim();
    setInputKeyword(nextKeyword);
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);

        if (normalizedKeyword.length >= 2) {
          nextParams.set("keyword", normalizedKeyword);
        } else {
          nextParams.delete("keyword");
        }
        nextParams.set("page", "1");

        return nextParams;
      },
      { replace: true },
    );
  };

  const updatePage = (nextPage: number) => {
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        nextParams.set("page", String(nextPage));
        return nextParams;
      },
      { replace: true },
    );
  };

  const updateSort = (nextSort: CommunityPostSort) => {
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        nextParams.set("sort", nextSort);
        nextParams.set("page", "1");
        return nextParams;
      },
      { replace: true },
    );
  };

  const handleWriteClick = () => {
    void runAfterLoginCheck(
      () => navigate("/community/write"),
      () => setShowLoginModal(true),
    );
  };

  const handlePostClick = (postId: number) => {
    void runAfterLoginCheck(
      () => navigate(`/community/${postId}`),
      () => setShowLoginModal(true),
    );
  };

  if (isPending) {
    return <AsyncState type="loading" />;
  }

  if (isError) {
    return <AsyncState type="error" />;
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-background-100">
      <div className="mx-auto flex flex-col px-[32px] py-[20px]">
        <CommunitySection onWriteClick={handleWriteClick} onPostClick={handlePostClick} />

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

          <CommunityToolbar
            keyword={inputKeyword}
            suggestions={suggestions}
            suggestionsLoading={areSuggestionsLoading}
            sort={sort}
            isLoggedIn={isLoggedIn}
            onKeywordChange={setInputKeyword}
            onSearch={handleSearch}
            onSortChange={updateSort}
          />

          {visiblePosts.length === 0 ? (
            <div className="py-16 text-center text-background-500">검색 결과가 없습니다.</div>
          ) : (
            <div className="grid grid-cols-2 gap-x-[20px] gap-y-[12px]">
              {visiblePosts.map((post) => {
                const postCategory = getCommunityCategoryByCode(post.boardType);

                return (
                  <CommunityPostCard
                    key={post.postId}
                    categoryLabel={communityCategoryMap[postCategory]}
                    title={post.title}
                    content={post.content}
                    likes={post.likeCount}
                    comments={post.commentCount}
                    views={post.viewCount}
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
            <Pagination currentPage={page} totalPages={data.totalPages} onChange={updatePage} />
          </div>
        )}
      </div>

      {showLoginModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto px-[20px] py-[40px]"
          onMouseDown={(event) => {
            const dialog = event.currentTarget.querySelector('[role="dialog"]');

            if (event.target instanceof Node && !dialog?.contains(event.target)) {
              setShowLoginModal(false);
            }
          }}
        >
          <OnboardCancelBox
            title="로그인하고 더 많은 기능을 이용해 보세요!"
            description={`회원가입 후 프로필을 등록하시면,\nAI 챗봇 질문, 정보 저장, 커뮤니티 활동을 제한 없이\n자유롭게 이용하실 수 있습니다.`}
            leftButtonText="둘러보기"
            rightButtonText="로그인/회원가입"
            className="z-[70]!"
            onLeftButtonClick={() => setShowLoginModal(false)}
            onRightButtonClick={() => navigate("/auth")}
          />
        </div>
      )}
    </div>
  );
}
