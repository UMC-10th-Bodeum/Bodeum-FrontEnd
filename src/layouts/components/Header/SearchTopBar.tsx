import { useState } from "react";
import HeaderSearchBar from "@/components/HeaderSearchBar";
import { useNavigate } from "react-router-dom";

export default function SearchTopBar() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const results = [
    {
      id: 1,
      title: "서울대학교병원",
      category: "병원",
    },
    {
      id: 2,
      title: "서울시립장애인복지관",
      category: "복지",
    },
    {
      id: 3,
      title: "한국장애인고용공단",
      category: "취업",
    },
  ];
  return (
    <header className="h-[60px] border-b border-background-250 bg-background-100 px-[20px] py-[10px]">
      <HeaderSearchBar
        value={keyword}
        onChange={setKeyword}
        results={results.filter((item) =>
          item.title.includes(keyword)
        )}
        onSelect={(item) => {
          navigate(`/info/${item.id}`);
        }}
      />;
    </header>
  );
}