import { useNavigate } from "react-router-dom";
import AIMsgIcon from "@/assets/icons/AIMsg.svg?react";
import MainButton from "./MainButton";

export default function AIChatButton() {
  const navigate = useNavigate();

  return (
    <MainButton
      size="M"
      onClick={() => navigate("/aichat")}
      className="h-[80px] w-full justify-start gap-[10px] rounded-[8px] px-[30px] py-2 text-left [&:not(:active)]:bg-main-200"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center">
        <AIMsgIcon className="h-8 w-8" aria-hidden="true" />
      </span>

      <span className="flex flex-col gap-1 whitespace-normal">
        <span className="text-h6 text-main-400">
          빠르고 간단한 정보 관련 안내는 AI 큐레이션에게
        </span>

        <span className="text-h3-category-sub text-background-600">
          AI 챗봇을 통해 질문해보세요
        </span>
      </span>
    </MainButton>
  );
}