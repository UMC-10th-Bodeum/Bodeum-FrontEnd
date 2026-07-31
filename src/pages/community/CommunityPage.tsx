import { useMemo, useState } from "react";
import CategoryButton from "@/components/CategoryButton";
import Input from "@/components/Input";
import Pagination from "@/components/pagination/Pagination";
import { Select } from "@/components/Select";
import CommunitySection from "./components/CommunitySection";
import CommunityPostCard from "./components/CommunityPostCard";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  communityCategoryMap,
  communityCategoryEntries,
  isCommunityCategory,
  type CommunityCategory,
} from "@/constants/communityCategory";
import type { CommunityPostPayload } from "@/types/community";

type CommunityPageLocationState = {
  publishedPost?: CommunityPostPayload & { id: number };
};
import { searchSuggestionMockData } from "@/mocks/search";

const categories: Array<{
  value: CommunityCategory | "ALL";
  label: string;
}> = [
  { value: "ALL", label: "전체" },
  ...communityCategoryEntries.map(([value, label]) => ({ value, label })),
];

const sortOptions = [
  { label: "조회순", value: "views" },
  { label: "공감순", value: "likes" },
  { label: "댓글순", value: "comments" },
];

type SortKey = "views" | "likes" | "comments";

const repeatedPosts = Array.from({ length: 14 }, (_, index) => {
  const [category] = communityCategoryEntries[index % communityCategoryEntries.length];

  return {
    id: index + 1,
    category,
    title: "ABA 치료 6개월째, 드디어 눈맞춤이 됐어요 😭",
    content:
      "처음엔 정말 막막했는데 여기 선배 부모님들 덕분에 ABA 치료사와 연결하고 꾸준히 했더니 드디어 반응이 생겼습니다.",
    likes: 142,
    comments: 38,
    views: 1204,
    imageCount: 3,
    createdAt: "2026-07-31T03:53:05.460Z",
  };
});

export default function CommunityPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const publishedPost = (location.state as CommunityPageLocationState | null)?.publishedPost;
  const categoryParam = searchParams.get("category");
  const [keyword, setKeyword] = useState("");
  const category: CommunityCategory | "ALL" = isCommunityCategory(categoryParam)
    ? categoryParam
    : "ALL";
  const [sort, setSort] = useState<SortKey | "">("");
  const [page, setPage] = useState(1);

  const posts = useMemo(() => {
    const availablePosts = publishedPost
      ? [
          {
            ...publishedPost,
            likes: 0,
            comments: 0,
            views: 0,
            imageCount: publishedPost.images.length,
            createdAt: "방금 전",
          },
          ...repeatedPosts,
        ]
      : repeatedPosts;
    const filteredPosts = availablePosts.filter(
      (post) =>
        post.title.includes(keyword) ||
        post.content.includes(keyword) ||
        communityCategoryMap[post.category].includes(keyword),
    );
    const activeSort: SortKey = sort || "views";

    return [...filteredPosts].sort((a, b) => b[activeSort] - a[activeSort]);
  }, [keyword, publishedPost, sort]);

  const selectCategory = (value: CommunityCategory | "ALL") => {
    if (value === "ALL") {
      setSearchParams({});
    } else {
      setSearchParams({ category: value });
    }
  };

  const handleSearch = (keyword: string) => {
    setKeyword(keyword);
    setPage(1);
  };

  const suggestions =
    keyword.trim().length >= 2
      ? searchSuggestionMockData.result.suggestions.filter((item) =>
        item.text.includes(keyword)
      )
      : [];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background-100">
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
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onEnter={handleSearch}
              suggestions={suggestions}
              onSuggestionClick={(text) => {
                setKeyword(text);
              }}
              placeholder="게시글을 검색해보세요"
              className="w-[640px] h-[44px]"
            />
            <Select
              options={sortOptions}
              value={sort}
              onChange={(value) => setSort(value as SortKey)}
              placeholder="조회순"
              variant="S"
              ariaLabel="게시글 정렬"
              className="w-[120px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-x-[20px] gap-y-[12px]">
            {posts.map((post) => (
              <CommunityPostCard
                key={post.id}
                {...post}
                onClick={() =>
                  navigate(`/community/${post.id}`, {
                    state: {
                      category: category === "ALL" ? post.category : category,
                      post: {
                        ...post,
                        diagnosis: "AUTISM",
                        author:
                          "authorVisibility" in post && post.authorVisibility === "ANONYMOUS"
                            ? "익명 부모님"
                            : "NN님 · Level1 · 자폐스펙트럼 · N세 아이",
                      },
                    },
                  })
                }
              />
            ))}
          </div>
        </div>

        <div className="py-2 mt-[5px]">
          <Pagination currentPage={page} totalPages={120} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}
