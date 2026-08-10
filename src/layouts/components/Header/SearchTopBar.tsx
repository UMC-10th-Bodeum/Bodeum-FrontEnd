import { useState } from "react";
import HeaderSearchBar from "@/components/search/HeaderSearchBar";
import { useNavigate } from "react-router-dom";
import { useInfoSearch } from "@/hooks/useInfo";

export default function SearchTopBar() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const { data: results = [] } = useInfoSearch(keyword);
  
  return (
    <header className="h-[60px] border-b border-background-250 bg-background-100 px-[20px] py-[10px]">
      <HeaderSearchBar
        value={keyword}
        onChange={setKeyword}
        results={results}
        onSelect={(item) => {
          navigate(`/info/${item.category}/${item.infoItemId}`)
        }}
      />
    </header>
  );
}