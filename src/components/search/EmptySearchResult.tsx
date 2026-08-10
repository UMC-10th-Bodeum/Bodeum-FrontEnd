import SearchIcon from "@/assets/icons/Search.svg?react";

export default function EmptySearchResult() {
  return (
    <div className="flex flex-col items-center justify-center py-[25.5px]">
      <SearchIcon className="mb-3 h-[50px] w-[50px] text-background-300" />
      <p className="text-h3-category-sub text-background-700">
        검색결과가 없어요
      </p>
      <p className="text-h6 text-background-400">
        검색어를 변경해보세요
      </p>
    </div>
  );
}