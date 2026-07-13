import { useState } from "react";
import Input from "@/components/Input";

export default function SearchTopBar() {
  const [keyword, setKeyword] = useState("");

  return (
    <header className="h-[60px] border-b border-background-250 bg-background-100 px-[20px] py-[10px]">
      <Input
        search
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="기관 · 병원 · 복지 · 취업 · 교육 정보를 검색해보세요"
        className="w-full"
      />
    </header>
  );
}