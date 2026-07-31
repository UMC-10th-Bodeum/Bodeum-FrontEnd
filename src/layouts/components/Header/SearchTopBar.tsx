import { useState } from "react";
import HeaderSearchBar from "@/components/HeaderSearchBar";
import { useNavigate } from "react-router-dom";
import { searchMockData } from "@/mocks/search";

export default function SearchTopBar() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const results = searchMockData.result.items.map((item) => ({
    id: item.infoItemId,
    title: item.name,
    category: item.category,
    tags: item.tags,
  }));
  
  return (
    <header className="h-[60px] border-b border-background-250 bg-background-100 px-[20px] py-[10px]">
      <HeaderSearchBar
        value={keyword}
        onChange={setKeyword}
        results={results.filter((item) =>
          item.title.includes(keyword)
        )}
        onSelect={(item) => {
          navigate(`/info/${item.id}`)
        }}
      />
    </header>
  );
}