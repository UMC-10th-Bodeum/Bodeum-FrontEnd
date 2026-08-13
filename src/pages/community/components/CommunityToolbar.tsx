import Input, { type InputSuggestion } from "@/components/Input";
import { Select } from "@/components/Select";
import type { CommunityPostSearchSuggestion, CommunityPostSort } from "@/types/community";

const sortOptions = [
  { label: "최신순", value: "latest" },
  { label: "조회순", value: "view" },
  { label: "공감순", value: "like" },
  { label: "댓글순", value: "comment" },
];

function mapCommunitySuggestion(
  suggestion: CommunityPostSearchSuggestion,
): InputSuggestion {
  return {
    text: suggestion.title,
    description: suggestion.content,
    value: suggestion.type === "POST_TITLE" ? suggestion.title : suggestion.content,
    type: suggestion.type,
  };
}

interface CommunityToolbarProps {
  keyword: string;
  suggestions: CommunityPostSearchSuggestion[];
  suggestionsLoading: boolean;
  sort: CommunityPostSort | "";
  isLoggedIn: boolean;
  onKeywordChange: (keyword: string) => void;
  onSearch: (keyword: string) => void;
  onSortChange: (sort: CommunityPostSort) => void;
}

export default function CommunityToolbar({
  keyword,
  suggestions,
  suggestionsLoading,
  sort,
  isLoggedIn,
  onKeywordChange,
  onSearch,
  onSortChange,
}: CommunityToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-6">
      <Input
        search
        searchType="community"
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
        onClear={() => onSearch("")}
        onEnter={onSearch}
        suggestions={suggestions.map(mapCommunitySuggestion)}
        suggestionsLoading={suggestionsLoading}
        onSuggestionClick={(nextKeyword) => {
          onKeywordChange(nextKeyword);
          onSearch(nextKeyword);
        }}
        placeholder="게시글을 검색해보세요"
        className="h-[44px] w-[640px]"
      />

      <Select
        options={sortOptions}
        value={sort}
        onChange={(value) => onSortChange(value as CommunityPostSort)}
        placeholder={isLoggedIn ? "최신순" : "조회순"}
        variant="S"
        ariaLabel="게시글 정렬"
        className="w-[120px]"
      />
    </div>
  );
}
